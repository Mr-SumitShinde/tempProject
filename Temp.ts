.fixed-right {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    z-index: 9999;
    background-color: #ffffff;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px 0 0 10px;
    padding: 20px;
    overflow-y: auto;
    transition: transform 0.3s ease;
}

.fixed-right:hover {
    transform: translateX(-5px);
}

@media (max-width: 768px) {
    .fixed-right {
        width: 80%;
        border-radius: 0;
    }
}