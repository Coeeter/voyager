// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use opener;
use serde::{Deserialize, Serialize};
use std::{fs::read_dir, io::ErrorKind, path::Path};

#[derive(Serialize, Deserialize)]
struct DirContents {
    name: String,
    is_dir: bool,
    size: u64,
    last_modified: u64,
    extension: String,
    file_path: String,
}

#[tauri::command]
fn get_dir_contents(dir_path: &str) -> Result<Vec<DirContents>, String> {
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

        let extension = match entry.path().extension() {
            Some(ext) => ext.to_string_lossy().to_string(),
            None => String::new(),
        };

        let file_path = entry.path().to_string_lossy().to_string();

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
fn open_file(file_path: &str) -> Result<(), String> {
    let path = Path::new(file_path);
    match opener::open(path) {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Error opening file: {}", err.to_string())),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_dir_contents, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
