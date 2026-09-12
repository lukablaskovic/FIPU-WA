import hashlib
import os
import tempfile
import unicodedata
from pathlib import Path
from unittest.mock import patch

from GoogleDriveAPI import upload_plan
from index import authenticate_google_drive, course_files


def test_sync():
    with patch.dict(os.environ, {'GITHUB_ACTIONS': 'true', 'GOOGLE_DRIVE_TOKEN_JSON': ''}):
        try:
            authenticate_google_drive()
        except ValueError as error:
            assert 'GOOGLE_DRIVE_TOKEN_JSON' in str(error)
        else:
            raise AssertionError('CI must fail without credentials, never open a login server')

    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        for number in range(1, 8):
            folder = root / f'WA{number} - Poslužitelj'
            folder.mkdir()
            for suffix in ('.md', '.pdf'):
                (folder / unicodedata.normalize('NFD', folder.name + suffix)).write_bytes(b'old')
            (folder / 'server.js').write_text('code')
            (folder / 'extra.pdf').write_bytes(b'exercise')
            (folder / 'app').mkdir()
            (folder / 'app' / 'README.md').write_text('example app')
        paths = course_files(root)
        assert len(paths) == 14
        assert all(p.suffix in {'.md', '.pdf'} for p in paths)
        assert all(p.parent.parent == root for p in paths)
        for number in range(1, 8):
            assert course_files(root, script=f'WA{number}') == paths[(number - 1) * 2:number * 2]
        for invalid in ('', 'WA0', 'WA8', '../WA1', 'WA1*'):
            try:
                course_files(root, script=invalid)
            except ValueError:
                pass
            else:
                raise AssertionError('Invalid lesson selector was accepted')
        remote = [{'id': str(i), 'name': unicodedata.normalize('NFC', p.name),
                   'mimeType': 'application/pdf' if p.suffix == '.pdf' else 'text/markdown',
                   'md5Checksum': hashlib.md5(b'old').hexdigest()}
                  for i, p in enumerate(paths)]
        assert upload_plan(paths, remote) == []
        paths[0].write_bytes(b'changed')
        plan = upload_plan(paths, remote)
        assert len(plan) == 1 and plan[0][1]['id'] == '0'
        assert plan[0][2] == b'changed'
        assert len(upload_plan(paths, [])) == 14
        for bad_paths, bad_remote in [([paths[0].parent / 'server.js'], []),
                                       (paths, remote + [remote[0]])]:
            try:
                upload_plan(bad_paths, bad_remote)
            except ValueError:
                pass
            else:
                raise AssertionError('Unsafe input was accepted')
        paths[0].unlink()
        assert course_files(root, script='WA2') == paths[2:4]
        try:
            course_files(root)
        except ValueError:
            pass
        else:
            raise AssertionError('Missing course file was accepted')
    print('Sync checks passed.')


if __name__ == '__main__':
    test_sync()
