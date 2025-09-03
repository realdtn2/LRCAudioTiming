# LRC Timer for AudioMass

This fork adds a floating **LRC Timer** button to AudioMass, allowing you to easily time lyrics for `.lrc` files.

## 🛠️ How to Build

### Automatically
- Windows: Launch build.bat
- Linux: Launch build.sh

### Manually
- Navigate to [here](build-instructions.md)

## 🚀 How to Run

### 1. Start the server
```
git clone https://github.com/realdtn2/LRCAudioTiming
cd LRCAudioTiming
cd src
python audiomass-server.py
```

### 2. Open the website
- Navigate to [http://localhost:5055/](http://localhost:5055/)

## 🎵 How to Use

### 1. Access the LRC Timer
- Click the floating ⏱️ button in the top-right corner of the screen.
- The LRC Timer modal will open.

### 2. Load an LRC File
- Click **Load LRC File**.
- Select an LRC file (`.lrc` or `.txt`).
- The file will be parsed and displayed with all lyric lines.

### 3. Time the Lyrics
- Navigate to the point in the song where a lyric should appear.
- Play the song so that your playback position matches the lyric start.
- Press **T** to timestamp that line with the current playback position.
- The timestamp will appear in `[MM:SS.mmm]` format.

### 4. Export the LRC
- Click **Export LRC** for standard format.
- Or click **Export Starmaker** to accommodate the quirks of Starmaker.

## 📂 File Format

### Input
```text
Glimmering beyond the landscape of Hell shines a thread, silver and narrow.
Emptily promising Heaven — the one who grabbed it plummeted down.
By no fault of anything but their heart full of holes, soaking with poison.
```

### Output
```text
[00:16.159] Glimmering beyond the landscape of Hell shines a thread, silver and narrow.
[00:22.755] Emptily promising Heaven — the one who grabbed it plummeted down.
[00:29.301] By no fault of anything but their heart full of holes, soaking with poison.
```

## 💡 Tips for Best Results
- **Prepare Your Audio**: Use [Stemroller](https://github.com/stemrollerapp/stemroller) to isolate vocals, then use those vocals to time lyrics.
- **Correct Timing**: Timestamp exactly when the lyric starts. A default -100 ms offset ensures you have enough time to sing.

## ⌨️ Keyboard Shortcuts
- **T** → Timestamp the current line with the current playback position.
