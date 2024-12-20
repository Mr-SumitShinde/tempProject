#certificate-template {
  width: 1000px; /* Desired width */
  height: 600px; /* Desired height */
  position: relative;
  background-color: #f3f3f3; /* Optional background color */
  overflow: hidden;
  font-family: Arial, sans-serif;
}

#certificate-image {
  position: absolute;
  top: 20px; /* Adjust for downward movement */
  left: 50px; /* Adjust for rightward movement */
  width: 300px; /* Adjust width */
  height: 300px; /* Adjust height */
  object-fit: cover;
}

#certificate-text {
  position: absolute;
  top: 100px; /* Move text upward */
  left: 100px; /* Move text leftward */
  font-size: 24px;
  font-weight: bold;
  color: #333;
}


<div id="certificate-template">
  <img
    id="certificate-image"
    src={previewPhoto || "placeholder-image-path.png"}
    alt="Profile"
  />
  <div id="certificate-text">
    {userName || "Your Name Here"}
  </div>
</div>


top: 85px;

left: 91px;

width: 273px;

✓ height:

272px;

border: 2px

solid