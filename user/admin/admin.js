/*
====================================================
OSFile ADMIN SYSTEM
====================================================

Admin URL:

/user/admin/

Password:

I_changed_the_blog12432143124

IMPORTANT:
This is a client-side authentication system.
It is NOT suitable for protecting sensitive
production data.

====================================================
*/


/* ==================================================
   CONFIGURATION
================================================== */

const PASSWORD =
    "I_changed_the_blog12432143124";

const SESSION_KEY =
    "osfile_admin_session";

const BLOG_KEY =
    "osfile_blogs";


/* ==================================================
   PASSWORD HASHING
==================================================

   We use PBKDF2 + SHA-256.

   The plaintext password is still present in this
   JavaScript because this is a client-side system.

   Therefore this should NOT be considered real
   server-side authentication.
================================================== */

const PASSWORD_SALT =
    "OSFILE_ADMIN_SALT_2026";


async function hashPassword(password) {

    const encoder =
        new TextEncoder();


    const passwordData =
        encoder.encode(password);


    const saltData =
        encoder.encode(PASSWORD_SALT);


    const key =
        await crypto.subtle.importKey(
            "raw",
            passwordData,
            {
                name: "PBKDF2"
            },
            false,
            [
                "deriveBits"
            ]
        );


    const hash =
        await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",

                salt: saltData,

                iterations: 100000,

                hash: "SHA-256"
            },

            key,

            256
        );


    return arrayBufferToHex(hash);
}


/* ==================================================
   ARRAY BUFFER → HEX
================================================== */

function arrayBufferToHex(buffer) {

    const bytes =
        new Uint8Array(buffer);


    return Array
        .from(bytes)
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}


/* ==================================================
   LOGIN
================================================== */

async function checkPassword(password) {

    /*
       Because this is client-side, we compare against
       the configured password.

       For real security, this comparison should happen
       on a server.
    */

    return password === PASSWORD;
}


/* ==================================================
   SHOW ADMIN PAGE
================================================== */

function showAdmin() {

    const loginPage =
        document.getElementById(
            "loginPage"
        );


    const adminPage =
        document.getElementById(
            "adminPage"
        );


    if (loginPage) {

        loginPage.style.display =
            "none";

    }


    if (adminPage) {

        adminPage.style.display =
            "block";

    }


    loadBlogs();
}


/* ==================================================
   SHOW LOGIN PAGE
================================================== */

function showLogin() {

    const loginPage =
        document.getElementById(
            "loginPage"
        );


    const adminPage =
        document.getElementById(
            "adminPage"
        );


    if (loginPage) {

        loginPage.style.display =
            "block";

    }


    if (adminPage) {

        adminPage.style.display =
            "none";

    }

}


/* ==================================================
   LOGIN FORM
================================================== */

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const passwordInput =
                document.getElementById(
                    "password"
                );


            const error =
                document.getElementById(
                    "loginError"
                );


            const password =
                passwordInput.value;


            const correct =
                await checkPassword(
                    password
                );


            if (correct) {

                /*
                   Store only the login state.

                   The password itself is NOT stored
                   in sessionStorage.
                */

                sessionStorage.setItem(
                    SESSION_KEY,
                    "authenticated"
                );


                passwordInput.value =
                    "";


                if (error) {

                    error.textContent =
                        "";

                }


                showAdmin();

            } else {

                if (error) {

                    error.textContent =
                        "Incorrect password.";

                }


                passwordInput.value =
                    "";


                passwordInput.focus();

            }

        }
    );

}


/* ==================================================
   LOGOUT
================================================== */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            sessionStorage.removeItem(
                SESSION_KEY
            );


            showLogin();

        }
    );

}


/* ==================================================
   DEFAULT BLOGS
================================================== */

const defaultBlogs = [

    {

        id: 1,

        title:
            "Welcome to OSFile",

        date:
            "September 28, 2026",

        content:
            "Welcome to OSFile! This is the first OSFile update."

    }

];


/* ==================================================
   GET BLOGS
================================================== */

function getBlogs() {

    const saved =
        localStorage.getItem(
            BLOG_KEY
        );


    if (!saved) {

        localStorage.setItem(
            BLOG_KEY,
            JSON.stringify(
                defaultBlogs
            )
        );


        return defaultBlogs;

    }


    try {

        const blogs =
            JSON.parse(saved);


        if (!Array.isArray(blogs)) {

            return defaultBlogs;

        }


        return blogs;

    } catch (error) {

        console.error(
            "Could not load blogs:",
            error
        );


        return defaultBlogs;

    }

}


/* ==================================================
   SAVE BLOGS
================================================== */

function saveBlogs(blogs) {

    localStorage.setItem(
        BLOG_KEY,
        JSON.stringify(blogs)
    );

}


/* ==================================================
   BLOG FORM
================================================== */

const blogForm =
    document.getElementById(
        "blogForm"
    );


if (blogForm) {

    blogForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const titleInput =
                document.getElementById(
                    "blogTitle"
                );


            const contentInput =
                document.getElementById(
                    "blogContent"
                );


            const title =
                titleInput.value.trim();


            const content =
                contentInput.value.trim();


            if (!title) {

                setStatus(
                    "Please enter a blog title."
                );

                titleInput.focus();

                return;

            }


            if (!content) {

                setStatus(
                    "Please enter blog content."
                );

                contentInput.focus();

                return;

            }


            const blogs =
                getBlogs();


            const newBlog = {

                id:
                    Date.now(),

                title:
                    title,

                date:
                    new Date().toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        }
                    ),

                content:
                    content

            };


            blogs.unshift(
                newBlog
            );


            saveBlogs(
                blogs
            );


            blogForm.reset();


            setStatus(
                "Blog published successfully."
            );


            loadBlogs();

        }
    );

}


/* ==================================================
   LOAD BLOGS
================================================== */

function loadBlogs() {

    const container =
        document.getElementById(
            "adminBlogList"
        );


    if (!container) {

        return;

    }


    const blogs =
        getBlogs();


    container.innerHTML =
        "";


    if (blogs.length === 0) {

        container.innerHTML = `

            <div class="blog-card">

                <h2>
                    No blogs yet
                </h2>

                <p>
                    Create your first OSFile blog above.
                </p>

            </div>

        `;

        return;

    }


    blogs.forEach(
        function(blog) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "blog-card";


            card.innerHTML = `

                <div class="blog-date">
                    ${escapeHTML(blog.date)}
                </div>

                <h2>
                    ${escapeHTML(blog.title)}
                </h2>

                <p>
                    ${escapeHTML(blog.content)}
                </p>

                <br>

                <button
                    class="admin-button secondary delete-blog"
                    type="button"
                >
                    Delete
                </button>

            `;


            const deleteButton =
                card.querySelector(
                    ".delete-blog"
                );


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteBlog(
                        blog.id
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


/* ==================================================
   DELETE BLOG
================================================== */

function deleteBlog(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this blog?"
        );


    if (!confirmed) {

        return;

    }


    const blogs =
        getBlogs();


    const updatedBlogs =
        blogs.filter(
            function(blog) {

                return blog.id !== id;

            }
        );


    saveBlogs(
        updatedBlogs
    );


    loadBlogs();


    setStatus(
        "Blog deleted."
    );

}


/* ==================================================
   DOWNLOAD BLOG DATA
================================================== */

const downloadButton =
    document.getElementById(
        "downloadBlogs"
    );


if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        function() {

            const blogs =
                getBlogs();


            const json =
                JSON.stringify(
                    blogs,
                    null,
                    4
                );


            const blob =
                new Blob(
                    [json],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "blogs.json";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );


            setStatus(
                "blogs.json downloaded."
            );

        }
    );

}


/* ==================================================
   STATUS MESSAGE
================================================== */

function setStatus(message) {

    const status =
        document.getElementById(
            "status"
        );


    if (!status) {

        return;

    }


    status.textContent =
        message;


    setTimeout(
        function() {

            status.textContent =
                "";

        },
        4000
    );

}


/* ==================================================
   ESCAPE HTML
================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* ==================================================
   CHECK EXISTING SESSION
================================================== */

const authenticated =
    sessionStorage.getItem(
        SESSION_KEY
    );


if (
    authenticated ===
    "authenticated"
) {

    showAdmin();

} else {

    showLogin();

}
