import React from "react"
import Hotel from "./Hotel"
import { FaClock, FaStar, FaRegStar, FaCalendarCheck } from "react-icons/fa";
import { Card, Carousel, Col, Container, Row } from "react-bootstrap";


const Hotellisting = () => {
	return (
		<section className="bg-light p-2 mb-5 ">


			<Row className="text-center mt-5 mb-4">
				<Col>
				<h2 className="fw-bold service-heading text-dark">
							Your Dream{" "}
							<span className="text-primary">Hotels</span>
						</h2>
					<p className="text-muted d-flex justify-content-center align-items-center mt-3">
						{/* Best Hotels Icon with a Star */}
						<FaStar className="icon-highlight text-warning me-2" /> Best Hotels{" "}
						<span className="text-success ms-2 fw-bold"> 24/7</span>
					</p>
					{/* Additional icons to represent hotel features */}
					<p className="text-muted d-flex justify-content-center align-items-center mt-3">
						<FaRegStar className="text-primary me-2" /> Luxury Stay
						<FaCalendarCheck className="text-success ms-4 me-2" /> Book Now
					</p>
				</Col>
			</Row>
			<Hotel />
		</section>
	)
}

export default Hotellisting
