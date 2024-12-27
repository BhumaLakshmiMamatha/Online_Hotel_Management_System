import React from "react";
import "../layout/MainHeader.css"; // Make sure to include your CSS file for styling
// import videoFile from "src/assets/Hotel.mp4";
import videoFile from "../../assets/Hotel.mp4";

const MainHeader = () => {
	return (
		<header className="header-banner">
			{/* Video Background */}
			<video className="header-video" autoPlay muted loop playsInline>
				<source src={videoFile} type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Overlay */}
			<div className="overlay"></div>

			{/* Content */}
			<div className="animated-texts overlay-content">
				<h1>
					Welcome to <span className="hotel-color">BOOK IT</span>
				</h1>
				<h4>Experience the Best Hospitality in Town</h4>
			</div>
		</header>
	);
};

export default MainHeader;
