/* LeftSideNavbar.css */
.left-navbar {
    width: 250px;
    height: 100vh; /* Full viewport height */
    background-color: #333; /* Background color */
    position: sticky; /* Make it sticky */
    top: 0; /* Stick to the top */
    left: 0; /* Stick to the left */
    padding-top: 20px;
    overflow-y: auto; /* Scroll if content overflows */
}

.left-navbar ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.left-navbar li {
    padding: 15px 20px;
}

.left-navbar a {
    color: white;
    text-decoration: none;
    display: block;
    transition: background-color 0.3s;
}

.left-navbar a:hover {
    background-color: #575757; /* Hover effect */
}