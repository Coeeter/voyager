// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod explorer;
use explorer::{get_dir_contents, get_starting_path, open_file};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_dir_contents,
            open_file,
            get_starting_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
