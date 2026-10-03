/*
    OSFile Website JavaScript

    Blog data is stored in localStorage while running
    as a normal website.

    The Windows OSFile application can later replace
    this storage system with actual local files.
*/

const BLOG_STORAGE_KEY = "osfile_blogs";

/*
    Default blog posts
*/

const defaultBlogs = [
  {
    id: 1,
    title: "Welcome to OSFile",
    date: "September 28, 2026",
    content:
      "Welcome to OSFile! OSFile is designed to give you a simple way to organize and launch the apps and files you use every day."
  }
];


/*
    Get blogs
*/

function getBlogs() {

  const saved = localStorage.getItem(BLOG_STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(
      BLOG_STORAGE_KEY,
      JSON.stringify(defaultBlogs)
    );

    return defaultBlogs;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {

    console.error("Could not load blogs:", error);

    return defaultBlogs;
  }
}


/*
    Save blogs
*/

function saveBlogs(blogs) {

  localStorage.setItem(
    BLOG_STORAGE_KEY,
    JSON.stringify(blogs)
  );
}


/*
    Create a blog
*/

function createBlog(title, content) {

  const blogs = getBlogs();

  const newBlog = {
    id: Date.now(),
    title: title,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }),
    content: content
  };

  blogs.unshift(newBlog);

  saveBlogs(blogs);

  return newBlog;
}


/*
    Display blogs
*/

function displayBlogs() {

  const container = document.getElementById("blogList");

  if (!container) {
    return;
  }

  const blogs = getBlogs();

  container.innerHTML = "";

  if (blogs.length === 0) {

    container.innerHTML = `
      <div class="blog-card">
        <h2>No blogs yet</h2>
        <p>There are currently no published blogs.</p>
      </div>
    `;

    return;
  }

  blogs.forEach(blog => {

    const article = document.createElement("article");

    article.className = "blog-card";

    article.innerHTML = `
      <div class="blog-date">${escapeHTML(blog.date)}</div>

      <h2>${escapeHTML(blog.title)}</h2>

      <p>${escapeHTML(blog.content)}</p>
    `;

    container.appendChild(article);
  });
}


/*
    Escape HTML so blog content cannot inject
    arbitrary HTML into the page.
*/

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


/*
    Download blog data
*/

function downloadBlogs() {

  const blogs = getBlogs();

  const data = JSON.stringify(blogs, null, 2);

  const blob = new Blob(
    [data],
    {
      type: "application/json"
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "osfile-blogs.json";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}


/*
    Admin page
*/

function setupAdmin() {

  const form = document.getElementById("blogForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function(event) {

    event.preventDefault();

    const title =
      document.getElementById("blogTitle").value.trim();

    const content =
      document.getElementById("blogContent").value.trim();

    if (!title || !content) {

      showStatus("Please enter a title and content.");

      return;
    }

    createBlog(title, content);

    form.reset();

    showStatus("Blog published successfully.");

    displayAdminBlogs();
  });


  const downloadButton =
    document.getElementById("downloadBlogs");

  if (downloadButton) {

    downloadButton.addEventListener(
      "click",
      downloadBlogs
    );
  }

  displayAdminBlogs();
}


/*
    Display existing blogs in admin
*/

function displayAdminBlogs() {

  const container =
    document.getElementById("adminBlogList");

  if (!container) {
    return;
  }

  const blogs = getBlogs();

  container.innerHTML = "";

  blogs.forEach(blog => {

    const item = document.createElement("div");

    item.className = "blog-card";

    item.innerHTML = `
      <div class="blog-date">
        ${escapeHTML(blog.date)}
      </div>

      <h2>${escapeHTML(blog.title)}</h2>

      <p>${escapeHTML(blog.content)}</p>

      <br>

      <button
        class="admin-button secondary"
        onclick="deleteBlog(${blog.id})">
        Delete
      </button>
    `;

    container.appendChild(item);
  });
}


/*
    Delete blog
*/

function deleteBlog(id) {

  const blogs = getBlogs();

  const updatedBlogs =
    blogs.filter(blog => blog.id !== id);

  saveBlogs(updatedBlogs);

  displayAdminBlogs();

  showStatus("Blog deleted.");
}


/*
    Status message
*/

function showStatus(message) {

  const status =
    document.getElementById("status");

  if (!status) {
    return;
  }

  status.textContent = message;

  setTimeout(() => {
    status.textContent = "";
  }, 3000);
}


/*
    Start application
*/

document.addEventListener(
  "DOMContentLoaded",
  () => {

    displayBlogs();

    setupAdmin();

  }
);
