# OSFile

OSFile is a static website for the OSFile project, with product information, a blog, installation pages, and a Windows download. The website itself is not a file manager; the desktop-style file layout on the home page is a visual preview.

The current downloadable application package is for Windows (version 1.0). macOS and Linux downloads are not available.

## Run the website locally

No build step or package installation is required. From the repository root, start a local web server:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Download for Windows

1. Open the website's Install page and choose Windows.
2. Download and extract the ZIP archive.
3. Run `OSFILE.exe` from the extracted folder.

The current archive is `installer/app/v/1.0/OSFileapp.zip`. It contains `OSFILE.exe` and supporting files; it does not contain a separate `OSFile.installer.exe` installer.

## Website notes

- Blog posts are stored in the browser's `localStorage`; they are not loaded from `blogs/osfile-blogs.json` automatically. Data is local to the browser and site origin.
- The admin page at `user/admin/index.html` can publish blog posts and download the stored blog data as JSON. Its password check runs in client-side JavaScript, so it is not secure authentication and must not be used to protect sensitive content.
- The Windows guide is at `gide/index.html` (the directory name is `gide`).

## Project structure

- `index.html` - home page and product preview
- `assets/` - logo, help content, and asset-credit page
- `blogs/` - blog page and JSON data file
- `css/style.css` - shared site styles
- `gide/` - Windows getting-started guide
- `install/` - install selection and Windows download pages
- `installer/app/v/1.0/` - download page and Windows ZIP archive
- `js/app.js` - blog display and browser storage logic
- `user/admin/` - client-side blog administration page
- `readme.md` - this file


## License

No license file is currently included in the repository.
