import argparse
import json
import os
import unicodedata
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
FOLDER_ID = '1hiWvS3vM1cwlSvyx7H-J9yMW8HfwgnxR'
SCOPES = ['https://www.googleapis.com/auth/drive']
SCRIPTS = tuple(f'WA{n}' for n in range(1, 8))


def course_files(root=ROOT, script=None):
    """Only the main WA1–WA7 Markdown/PDF pairs, never example repositories."""
    files = []
    if script is not None and script not in SCRIPTS:
        raise ValueError('Choose a script from WA1 through WA7.')
    for number in ([int(script[2:])] if script is not None else range(1, 8)):
        folders = list(root.glob(f'WA{number} - *'))
        if len(folders) != 1:
            raise ValueError(f'Expected one WA{number} course folder.')
        folder = folders[0]
        for suffix in ('.md', '.pdf'):
            matches = [p for p in folder.iterdir()
                       if p.suffix.lower() == suffix
                       and unicodedata.normalize('NFC', p.stem) == unicodedata.normalize('NFC', folder.name)
                       and p.is_file() and not p.is_symlink()]
            if len(matches) != 1 or folder.is_symlink():
                raise ValueError(f'Expected one main {suffix} file in {folder.name}.')
            files.extend(matches)
    return files


def authenticate_google_drive():
    secret = os.environ.get('GOOGLE_DRIVE_TOKEN_JSON')
    if os.environ.get('GITHUB_ACTIONS') == 'true' and not secret:
        raise ValueError('The GOOGLE_DRIVE_TOKEN_JSON Actions secret is required.')

    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build

    if secret:
        creds = Credentials.from_authorized_user_info(json.loads(secret), SCOPES)
        creds.refresh(Request())
        return build('drive', 'v3', credentials=creds)
    token = SCRIPT_DIR / 'token.json'
    creds = Credentials.from_authorized_user_file(str(token), SCOPES) if token.exists() else None
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                str(SCRIPT_DIR / 'credentials.json'), SCOPES)
            creds = flow.run_local_server(port=0, open_browser=False)
        with os.fdopen(os.open(token, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), 'w') as output:
            output.write(creds.to_json())
    return build('drive', 'v3', credentials=creds)


def main():
    parser = argparse.ArgumentParser(description='Upload only the 14 main WA Markdown/PDF files.')
    parser.add_argument('--folder-id', default=FOLDER_ID, help='Destination Google Drive folder ID (default: Web aplikacije)')
    parser.add_argument('--list-local', action='store_true', help='List selected files without connecting')
    parser.add_argument('--dry-run', action='store_true', help='Read Drive and show changes without uploading')
    parser.add_argument('--script', choices=SCRIPTS, help='Select one lesson (default: all seven)')
    args = parser.parse_args()
    files = course_files(script=args.script)
    if args.list_local:
        print('\n'.join(str(p.relative_to(ROOT)) for p in files))
        return
    if not args.folder_id:
        parser.error('--folder-id is required')

    from GoogleDriveAPI import GoogleDriveAPI
    drive = GoogleDriveAPI(args.folder_id, authenticate_google_drive)
    folder = drive.Drive_service.files().get(
        fileId=args.folder_id, fields='name,mimeType,capabilities(canAddChildren)').execute()
    if folder['mimeType'] != 'application/vnd.google-apps.folder' or not folder['capabilities'].get('canAddChildren'):
        raise ValueError('The destination must be a writable Drive folder.')
    print(f"Destination: {folder['name']} ({args.folder_id})", flush=True)
    drive.sync_files(files, dry_run=args.dry_run)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pass
