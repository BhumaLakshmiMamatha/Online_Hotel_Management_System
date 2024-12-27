import React, { useState } from "react";
import { addRoom } from "../utils/ApiFunctions";
import RoomTypeSelector from "../common/RoomTypeSelector";
import { Link, useNavigate } from "react-router-dom";

const AddRoom = () => {
	const [newRoom, setNewRoom] = useState({
		photo: null,
		roomType: "",
		roomPrice: "",
	});

	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [imagePreview, setImagePreview] = useState("");

	const handleRoomInputChange = (e) => {
		const { name, value } = e.target;
		setNewRoom({ ...newRoom, [name]: name === "roomPrice" ? (isNaN(value) ? "" : parseInt(value)) : value });
	};

	const handleImageChange = (e) => {
		const selectedImage = e.target.files[0];
		setNewRoom({ ...newRoom, photo: selectedImage });
		setImagePreview(URL.createObjectURL(selectedImage));
	};

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const success = await addRoom(newRoom.photo, newRoom.roomType, newRoom.roomPrice);
			if (success !== undefined) {
				setSuccessMessage("A new room was added successfully!");
				setNewRoom({ photo: null, roomType: "", roomPrice: "" });
				setImagePreview("");
				setErrorMessage("");
				navigate("/existing-rooms");
			} else {
				setErrorMessage("Error adding new room");
			}
		} catch (error) {
			setErrorMessage(error.message);
		}
		setTimeout(() => {
			setSuccessMessage("");
			setErrorMessage("");
		}, 3000);
	};

	return (
		<section className="container py-5">
			<div className="row justify-content-center">
				<div className="col-md-10 col-lg-8 mt-1" style={{width:'900px'}}>
					<div className="card shadow-sm border-0">
						<div className="card-header bg-primary p-3 text-white">
							<h4 className="mb-0 text-center">Add a New Room</h4>
						</div>
						<div className="card-body p-4">
							{successMessage && (
								<div className="alert alert-success alert-dismissible fade show" role="alert">
									{successMessage}
									<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
								</div>
							)}
							{errorMessage && (
								<div className="alert alert-danger alert-dismissible fade show" role="alert">
									{errorMessage}
									<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
								</div>
							)}
							<form onSubmit={handleSubmit}>
								<div className="d-flex align-items-start gap-2 ">
									{/* Left Side: Form Fields */}
									<div className="flex-grow-1">
										<div className="mb-4">
											<label htmlFor="roomType" className="form-label fw-bold">
												Room Type
											</label>
											<RoomTypeSelector
												handleRoomInputChange={handleRoomInputChange}
												newRoom={newRoom}
											/>
										</div>
										<div className="mb-4">
											<label htmlFor="roomPrice" className="form-label fw-bold">
												Room Price <span className="text-muted">(₹)</span>
											</label>
											<input
												required
												type="number"
												className="form-control form-control-lg"
												id="roomPrice"
												name="roomPrice"
												value={newRoom.roomPrice}
												onChange={handleRoomInputChange}
												placeholder="Enter room price"
											/>
										</div>
										<div className="mb-4">
											<label htmlFor="photo" className="form-label fw-bold">
												Room Photo
											</label>
											<input
												required
												name="photo"
												id="photo"
												type="file"
												className="form-control"
												onChange={handleImageChange}
											/>
										</div>
										<div className="d-flex justify-content-between">
											<Link to="/existing-rooms" className="btn btn-outline-info btn-lg" >
												Existing Rooms
											</Link>
											<button type="submit" className="btn btn-primary btn-lg">
												Save Room
											</button>
										</div>
									</div>
									{/* Right Side: Image Preview */}
									{imagePreview && (
										<div className="text-center ">
											<img
												src={imagePreview}
												alt="Room Preview"
												className="img-fluid rounded shadow-sm mt-4"
												style={{ maxWidth: "500px", height: "auto" }}
											/>
											<p className="text-muted mt-2">Preview</p>
										</div>
									)}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AddRoom;
