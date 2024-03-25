// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct DirContents {
    name: String,
    is_dir: bool,
    size: u64,
    last_modified: u64,
    extension: String,
}

#[tauri::command]
fn get_dir_contents(dir_path: &str) -> Vec<DirContents> {
    let mut contents: Vec<DirContents> = Vec::new();
    let dir = std::fs::read_dir(dir_path).expect(&format!("Error reading directory: {}", dir_path));
    for entry in dir {
        let entry = match entry {
            Ok(entry) => entry,
            Err(_) => continue,
        };
        let metadata = entry
            .metadata()
            .expect(&format!("Error reading metadata for: {:?}", entry.path()));
        let is_dir = metadata.is_dir();
        let size = metadata.len();
        let last_modified = match metadata.modified() {
            Ok(time) => match time.elapsed() {
                Ok(duration) => duration.as_secs(),
                Err(_) => 0,
            },
            Err(_) => 0,
        };
        let extension = match entry.path().extension() {
            Some(ext) => ext.to_str().unwrap_or("").to_string(),
            None => "".to_string(),
        };
        let name = entry.file_name().into_string().unwrap_or("".to_string());
        contents.push(DirContents {
            name,
            is_dir,
            size,
            last_modified,
            extension,
        })
    }
    contents
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_dir_contents])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
