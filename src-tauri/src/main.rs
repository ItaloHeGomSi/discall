// Previne a janela do console no Windows em release build
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    discall_lib::run();
}
