use opener;
use serde::{Deserialize, Serialize};
use std::{fs::read_dir, io::ErrorKind, os::windows::fs::MetadataExt, path::Path};

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
pub fn get_dir_contents(
    dir_path: &str,
    include_hidden: Option<bool>,
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
        let file_path = entry.path().to_string_lossy().to_string();
        let is_dir = metadata.is_dir();
        let size = metadata.len();
        let last_modified = metadata.modified().unwrap().elapsed().unwrap().as_secs();
        let extension = match entry.path().extension() {
            Some(ext) => ext.to_string_lossy().to_string(),
            None => String::new(),
        };

        let include_hidden = match include_hidden {
            Some(include_hidden) => include_hidden,
            None => false,
        };

        // check if file is hidden
        if metadata.file_attributes() & 2 != 0 && !include_hidden {
            continue;
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
