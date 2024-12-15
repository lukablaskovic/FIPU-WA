import os
from logger import logger
from googleapiclient.http import MediaFileUpload
class GoogleDriveAPI:
    def __init__(self, folder_id, auth_function):
        self.Drive_service = auth_function()
        self.folder_id = folder_id
    def list_folders(self):
        query = "mimeType = 'application/vnd.google-apps.folder' and trashed = false"
        results = self.Drive_service.files().list(q=query).execute()
        folders = results.get('files', [])

        if not folders:
            logger.warning("[GoogleDriveAPI]: No folders found.")
        else:
            logger.info("[GoogleDriveAPI]: Folders:")
            for folder in folders:
                print(f"{folder['name']} (ID: {folder['id']})")
    def list_files_in_folder(self):
        query = f"'{self.folder_id}' in parents and trashed = false"
        results = self.Drive_service.files().list(q=query).execute()
        return results.get('files', [])
    def find_file_by_name(self, files, filename):
        for file in files:
            if file['name'] == filename:
                return file
        return None
    def update_file_metadata(self, file_id, new_title):
        file_metadata = {'name': new_title}
        updated_file = self.Drive_service.files().update(fileId=file_id, body=file_metadata).execute()
        logger.info(f"[GoogleDriveAPI]: Updated file {updated_file['name']} (ID: {updated_file['id']}")
        
    def upload_new_file(self, local_pdf_path, existing_file_id=None):
        file_metadata = {
            'name': os.path.basename(local_pdf_path)
        }
        
        media = MediaFileUpload(local_pdf_path, mimetype='application/pdf')
        
        if existing_file_id:
            # Update an existing file
            self.Drive_service.files().update(
                fileId=existing_file_id,
                body=file_metadata,
                media_body=media,
                addParents=self.folder_id
            ).execute()
            logger.info(f"[GoogleDriveAPI]: Replaced file with new PDF: {file_metadata['name']} (ID: {existing_file_id})")
        else:
            # Upload a new file
            file_metadata['parents'] = [self.folder_id]
            uploaded_file = self.Drive_service.files().create(
                body=file_metadata,
                media_body=media
            ).execute()
            logger.info(f"[GoogleDriveAPI]: Uploaded new PDF: {uploaded_file['name']} (ID: {uploaded_file['id']})")