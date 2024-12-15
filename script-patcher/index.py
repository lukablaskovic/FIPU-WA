import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

from GoogleDriveAPI import GoogleDriveAPI

# https://github.com/googleapis/google-auth-library-python-oauthlib
# https://github.com/googleapis/google-api-python-client

from logger import logger

GOOGLE_DRIVE_API_SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive']
PICKLE_FILE_NAME = "token.pickle"
FOLDER_ID = "1y8PUAFmYoW-cBrvgdd8hCnhni39PNkXV"

def authenticate_google_drive():
    creds = None
    # Check if token.pickle exists
    if os.path.exists(PICKLE_FILE_NAME):
        logger.info(f"Using local token.pickle.")
        with open(PICKLE_FILE_NAME, 'rb') as token:
            creds = pickle.load(token)

    # If credentials are invalid, reauthenticate
    if not creds or not creds.valid:
        logger.warning("Credentials not found or invalid. Prompting user to authenticate...")

        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Authenticate using the OAuth credentials from the credentials.json file
            if os.path.exists("credentials.json"):
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', GOOGLE_DRIVE_API_SCOPES)
                creds = flow.run_local_server(port=0)
            else:
                raise ValueError("credentials.json not found")

        # Save the credentials to token.pickle for future use
        with open(PICKLE_FILE_NAME, 'wb') as token:
            logger.info(f"Saving credentials as {PICKLE_FILE_NAME}...")
            pickle.dump(creds, token)

    logger.info(f"Successfully loaded credentials from {PICKLE_FILE_NAME}!")
    return build('drive', 'v3', credentials=creds)


def check_local_availability(SCRIPTS_LOCAL_FULL_PATHS) -> bool:
    logger.info("Checking local availability of scripts...")
    if not SCRIPTS_LOCAL_FULL_PATHS:
        logger.error("SCRIPTS_LOCAL_FULL_PATHS is empty.")
        return False
    for file in SCRIPTS_LOCAL_FULL_PATHS.values(): # Check if all scripts are locally available
        local_file_exists(file)
    logger.info("All scripts are locally available!")
    return True

def local_file_exists(file_path) -> bool:
    if os.path.exists(file_path):
        logger.debug(f"Local file {file_path} exists.")
        return True
    else:
        logger.error(f"Local file {file_path} does not exist.")
        return False

def setup_script_paths() -> tuple:
    logger.info("Setting up script paths...")
    script_dir = os.path.dirname(os.path.abspath(__file__)) # /Users/lukablaskovic/Github/FIPU-WA/script-patcher

    root_dir = os.path.abspath(os.path.join(script_dir, os.pardir)) # /Users/lukablaskovic/Github/FIPU-WA

    SCRIPTS_FILE_NAMES = {
    "WA1": "WA1 - Uvod u HTTP, Node i Express",
    "WA2": "WA2 - Usmjeravanje na Express poslužitelju",
    "WA3": "WA3 - Komunikacija s klijentskom stranom",
    "WA4": "WA4 - Upravljanje podacima na poslužiteljskoj strani",
    "WA5": "WA5 - MongoDB baza podataka",
    }
    
    
    SCRIPTS_FILE_NAMES_w_PDF = {key: f"{value}.pdf" for key, value in SCRIPTS_FILE_NAMES.items()}
    
    SCRIPTS_LOCAL_FULL_PATHS = {
    "WA1": os.path.join(root_dir, SCRIPTS_FILE_NAMES["WA1"], SCRIPTS_FILE_NAMES_w_PDF["WA1"]),
    "WA2" : os.path.join(root_dir, SCRIPTS_FILE_NAMES["WA2"], SCRIPTS_FILE_NAMES_w_PDF["WA2"]),
    "WA3": os.path.join(root_dir, SCRIPTS_FILE_NAMES["WA3"], SCRIPTS_FILE_NAMES_w_PDF["WA3"]),
    "WA4" : os.path.join(root_dir, SCRIPTS_FILE_NAMES["WA4"], SCRIPTS_FILE_NAMES_w_PDF["WA4"]),
    "WA5" : os.path.join(root_dir, SCRIPTS_FILE_NAMES["WA5"], SCRIPTS_FILE_NAMES_w_PDF["WA5"]),
    }
    # Full path example: /Users/lukablaskovic/Github/FIPU-WA/WA1 - Uvod u HTTP, Node i Express/WA1 - Uvod u HTTP, Node i Express.pdf
    logger.info("Script paths set up successfully!")
    return SCRIPTS_LOCAL_FULL_PATHS, SCRIPTS_FILE_NAMES_w_PDF

def main():    
    SCRIPTS_LOCAL_FULL_PATHS, SCRIPTS_FILE_NAMES_w_PDF = setup_script_paths()
    
    check_local_availability(SCRIPTS_LOCAL_FULL_PATHS)
    
    Drive = GoogleDriveAPI(FOLDER_ID, authenticate_google_drive)
    FILES_ON_DRIVE = Drive.list_files_in_folder()
    
    Drive_files_dict = {file['name']: file['id'] for file in FILES_ON_DRIVE}
    
    if not FILES_ON_DRIVE:
        logger.warning("No files found on Drive.")
        raise FileNotFoundError("No files found on Drive.")

    for script_name, local_path in SCRIPTS_LOCAL_FULL_PATHS.items():
        script_pdf_name = SCRIPTS_FILE_NAMES_w_PDF[script_name]
        logger.info(f"Processing file: {script_pdf_name}")
        
        if script_pdf_name in Drive_files_dict:
            # File exists on Drive, update it
            file_id = Drive_files_dict[script_pdf_name]
            logger.info(f"File {script_pdf_name} found on Drive. Updating it.")
            Drive.upload_new_file(local_path, existing_file_id=file_id)
        else:
            # File does not exist on Drive, upload it
            logger.info(f"File {script_pdf_name} not found on Drive. Uploading it as new.")
            Drive.upload_new_file(local_path)
    
if __name__ == "__main__":
    logger.info("Starting script-patcher")
    logger.info(f"FOLDER_ID is set to: {FOLDER_ID}")
    main()