.left-navbar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 250px;
    height: 100vh;
    background-color: #333;
    position: sticky;
    top: 0;
    left: 0;
    padding-top: 20px;
    overflow-y: auto;

    ul {
        display: flex;
        flex-direction: column;
        width: 100%;
        list-style-type: none;
        padding: 0;
        margin: 0;

        li {
            width: 100%;
            padding: 15px 20px;

            a {
                color: white;
                text-decoration: none;
                display: block;
                width: 100%;
                transition: background-color 0.3s;

                &:hover {
                    background-color: #575757;
                }
            }
        }
    }
}