use dirs::{audio_dir, desktop_dir, document_dir, download_dir, home_dir, picture_dir, video_dir};
use opener;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use serde::{Deserialize, Serialize};
use std::{
    fs::{read_dir, DirEntry},
    path::{Path, PathBuf},
};

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

#[derive(Serialize, Deserialize)]
pub struct SystemPaths {
    home: Option<String>,
    desktop: Option<String>,
    documents: Option<String>,
    downloads: Option<String>,
    pictures: Option<String>,
    music: Option<String>,
    videos: Option<String>,
}

#[tauri::command]
pub fn get_system_paths() -> SystemPaths {
    let closure = |path: PathBuf| path.to_string_lossy().to_string();

    SystemPaths {
        home: home_dir().map(&closure),
        desktop: desktop_dir().map(&closure),
        documents: document_dir().map(&closure),
        downloads: download_dir().map(&closure),
        pictures: picture_dir().map(&closure),
        music: audio_dir().map(&closure),
        videos: video_dir().map(&closure),
    }
}

#[tauri::command]
pub fn get_dir_contents(
    dir_path: &str,
    include_hidden: Option<bool>,
) -> Result<Vec<DirContents>, String> {
    let dir = read_dir(dir_path)
        .map_err(|err| format!("Error reading directory: {}", err.to_string()))?;

    let entries: Vec<DirEntry> = dir.filter_map(Result::ok).collect();

    let execute_concurrently = entries.len() > 20;

    let process_entry = |entry: &DirEntry| process_entry(entry, include_hidden);
    let filter_map = |entry: Option<DirContents>| entry;

    let dir_contents: Vec<DirContents> = if execute_concurrently {
        entries
            .par_iter()
            .map(&process_entry)
            .filter_map(&filter_map)
            .collect()
    } else {
        entries
            .iter()
            .map(&process_entry)
            .filter_map(&filter_map)
            .collect()
    };

    Ok(dir_contents)
}

fn process_entry(entry: &DirEntry, _include_hidden: Option<bool>) -> Option<DirContents> {
    let metadata = match entry.metadata() {
        Ok(metadata) => metadata,
        Err(_) => {
            return None;
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
        if metadata.file_attributes() & 2 != 0 && !include_hidden {
            return None;
        }
    }

    Some(DirContents {
        name,
        is_dir,
        size,
        last_modified,
        extension,
        file_path,
    })
}

#[tauri::command]
pub fn open_file(file_path: &str) -> Result<(), String> {
    let path = Path::new(file_path);
    match opener::open(path) {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Error opening file: {}", err.to_string())),
    }
}
