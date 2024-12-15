import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from googleapiclient.http import MediaFileUpload

from logger import logger

SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive']

FOLDER_ID = "1y8PUAFmYoW-cBrvgdd8hCnhni39PNkXV"

def authenticate_google_drive():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens
    PICKLE_FILE_NAME = "token.pickle"
    if os.path.exists(PICKLE_FILE_NAME):
        with open(PICKLE_FILE_NAME, 'rb') as token:
            creds = pickle.load(token)
    
    if not creds or not creds.valid:
        logger.warning("Credentials not found or invalid. Prompting user to authenticate...")
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        with open('token.pickle', 'wb') as token:
            logger.info(f"Saving credentials as {PICKLE_FILE_NAME}...")
            pickle.dump(creds, token)
    
    logger.info(f"Successfully loaded credentials from {PICKLE_FILE_NAME}!")
    return build('drive', 'v3', credentials=creds)

class GoogleDriveAPI:
    def __init__(self):
        self.drive_service = authenticate_google_drive()
    def list_folders(self):
        query = "mimeType = 'application/vnd.google-apps.folder' and trashed = false"
        results = self.drive_service.files().list(q=query).execute()
        folders = results.get('files', [])

        if not folders:
            print("No folders found.")
        else:
            print("Folders in your Google Drive:")
            for folder in folders:
                print(f"{folder['name']} (ID: {folder['id']})")
    def list_files_in_folder(self, folder_id):
        query = f"'{folder_id}' in parents and trashed = false"
        results = self.drive_service.files().list(q=query).execute()
        return results.get('files', [])
    def find_file_by_name(self, files, filename):
        for file in files:
            if file['name'] == filename:
                return file
        return None
    def update_file_metadata(self, file_id, new_title):
        file_metadata = {'name': new_title}
        updated_file = self.drive_service.files().update(fileId=file_id, body=file_metadata).execute()
        print(f"Updated file {updated_file['name']} (ID: {updated_file['id']}")
        
    def upload_new_file(self, folder_id, local_pdf_path, existing_file_id=None):
        file_metadata = {
            'name': os.path.basename(local_pdf_path)
        }
        
        media = MediaFileUpload(local_pdf_path, mimetype='application/pdf')
        
        if existing_file_id:
            self.drive_service.files().update(
                fileId=existing_file_id,
                addParents=folder_id,
                removeParents=None,
                body=file_metadata,
                media_body=media
            ).execute()
            print(f"Replaced file with new PDF: {file_metadata['name']} (ID: {existing_file_id})")
        else:
            uploaded_file = self.drive_service.files().create(
                body=file_metadata,
                media_body=media,
                parents=[folder_id]
            ).execute()
            print(f"Uploaded new PDF: {uploaded_file['name']} (ID: {uploaded_file['id']})")

def check_script_paths(SCRIPT_PATHS):
    for file in SCRIPT_PATHS.values():
        local_file_exists(file)

def local_file_exists(file_path):
    if os.path.exists(file_path):
        print(f"Local file {file_path} exists.")
        return True
    else:
        print(f"Local file {file_path} does not exist.")
        return False

def main():
    Drive = GoogleDriveAPI()
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.abspath(os.path.join(script_dir, os.pardir))
    print("root_dir:", root_dir)
    
    SCRIPT_FILE_NAMES = {
    "WA1": "WA1 - Uvod u HTTP, Node i Express",
    "WA2": "WA2 - Usmjeravanje na Express poslužitelju",
    "WA3": "WA3 - Komunikacija s klijentskom stranom",
    "WA4": "WA4 - Upravljanje podacima na poslužiteljskoj strani",
    "WA5": "WA5 - MongoDB baza podataka",
    }
    
    SCRIPT_FILE_NAMES_PDF = {key: f"{value}.pdf" for key, value in SCRIPT_FILE_NAMES.items()}
    
    SCRIPT_PATHS = {
    "WA1": os.path.join(root_dir, SCRIPT_FILE_NAMES["WA1"], SCRIPT_FILE_NAMES_PDF["WA1"]),
    "WA2" : os.path.join(root_dir, SCRIPT_FILE_NAMES["WA2"], SCRIPT_FILE_NAMES_PDF["WA2"]),
    "WA3": os.path.join(root_dir, SCRIPT_FILE_NAMES["WA3"], SCRIPT_FILE_NAMES_PDF["WA3"]),
    "WA4" : os.path.join(root_dir, SCRIPT_FILE_NAMES["WA4"], SCRIPT_FILE_NAMES_PDF["WA4"]),
    "WA5" : os.path.join(root_dir, SCRIPT_FILE_NAMES["WA5"], SCRIPT_FILE_NAMES_PDF["WA5"]),
    }
    
    check_script_paths(SCRIPT_PATHS)
    return
    files_in_folder = Drive.list_files_in_folder(FOLDER_ID)
    print("Files in the folder:", files_in_folder)
    
    files_to_find = list(SCRIPT_FILE_NAMES_PDF.values())
    for filename in files_to_find:
        file = Drive.find_file_by_name(files_in_folder, filename)
        if file:
            print(f"Found {filename} (ID: {file['id']})")

            #Drive.upload_new_file(FOLDER_ID, new_pdf_path, file['id'])
        else:
            print(f"{filename} not found in the folder.")
            
if __name__ == "__main__":
    main()