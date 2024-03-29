// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod explorer;
use explorer::{create_dir, create_file, get_dir_contents, get_system_paths, open_file};

fn main() {
    get_system_paths();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_dir_contents,
            open_file,
            get_system_paths,
            create_dir,
            create_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
