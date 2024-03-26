use dirs::home_dir;
use opener;
use serde::{Deserialize, Serialize};
use std::{fs::read_dir, io::ErrorKind, path::Path};

#[cfg(target_os = "windows")]
use std::os::windows::fs::MetadataExt;

#[derive(Serialize, Deserialize)]
pub struct DirContents {
    name: String,
    is_dir: bool,
    size: u64,
    last_modified: u64,
    extension: String,
    file_path: String,
}

#[tauri::command]
pub fn get_starting_path() -> Result<String, String> {
    let path = match home_dir() {
        Some(path) => path,
        None => return Err("Error getting home directory".to_string()),
    };

    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn get_dir_contents(
    dir_path: &str,
    _include_hidden: Option<bool>,
) -> Result<Vec<DirContents>, String> {
    let mut contents = Vec::new();

    let dir = match read_dir(dir_path) {
        Ok(dir) => dir,
        Err(err) => return Err(format!("Error reading directory: {}", err.to_string())),
    };

    for entry in dir.flat_map(|entry| match entry {
        Ok(entry) => Some(entry),
        Err(_) => None,
    }) {
        let metadata = match entry.metadata() {
            Ok(metadata) => metadata,
            Err(err) => {
                if err.kind() == ErrorKind::NotFound {
                    continue; // Skip missing files silently
                } else {
                    return Err(format!("Error getting file metadata: {}", err.to_string()));
                }
            }
        };

        let name = entry.file_name().into_string().unwrap();
        let is_dir = metadata.is_dir();
        let size = metadata.len();
        let last_modified = metadata.modified().unwrap().elapsed().unwrap().as_secs();
        let file_path = entry.path().to_string_lossy().to_string();
        let extension = match entry.path().extension() {
            Some(ext) => ext.to_string_lossy().to_string(),
            None => String::new(),
        };

        #[cfg(target_os = "windows")]
        {
            let include_hidden = match _include_hidden {
                Some(include_hidden) => include_hidden,
                None => false,
            };
            // check if file is hidden
            if metadata.file_attributes() & 2 != 0 && !include_hidden {
                continue;
            }
        }

        contents.push(DirContents {
            name,
            is_dir,
            size,
            last_modified,
            extension,
            file_path,
        });
    }

    Ok(contents)
}

#[tauri::command]
pub fn open_file(file_path: &str) -> Result<(), String> {
    let path = Path::new(file_path);
    match opener::open(path) {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Error opening file: {}", err.to_string())),
    }
}
