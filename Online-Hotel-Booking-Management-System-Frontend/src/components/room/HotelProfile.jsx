import React, { useState, useEffect } from "react";
import { getHotelById, updateHotelDetails, addHotel } from "../utils/ApiFunctions";
import { FaHotel, FaEdit, FaSave, FaPlus, FaPhoneAlt, FaCity, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const HotelProfile = () => {
    const [hotelInfo, setHotelInfo] = useState({
        hotelId: "",
        hotelName: "",
        hotelAddress: "",
        city: "",
        phoneNumber: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    
    
    const hotelId = localStorage.getItem("hotelId");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (hotelId) {
            const fetchHotelDetails = async () => {
                try {
                    const data = await getHotelById(hotelId);
                    setHotelInfo(data);
                    setIsLoading(false);
                } catch (error) {
                    setError(error.message);
                    setIsLoading(false);
                }
            };
            fetchHotelDetails();
        } else {
            setIsLoading(false);
        }
    }, [hotelId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHotelInfo({ ...hotelInfo, [name]: value });
    };

    const handleSave = async () => {
        try {
            if (hotelId) {
                await updateHotelDetails(hotelId, hotelInfo);
                setSuccessMessage("Hotel details updated successfully");
            } else {
                const newHotel = await addHotel(hotelInfo);
                setHotelInfo({ ...hotelInfo, hotelId: newHotel.id });
                localStorage.setItem("hotelId", newHotel.id);
                setSuccessMessage("New hotel added successfully");
                setIsLoading(true);
            }
            setIsEditing(false);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <section style={{ backgroundColor: "#f7f9fc", padding: "20px" }}>
            {successMessage && (
                <div className="alert alert-success" role="alert" style={{ backgroundColor: "#d4edda", borderColor: "#c3e6cb" }}>
                    <FaSave /> {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger" role="alert" style={{ backgroundColor: "#f8d7da", borderColor: "#f5c6cb" }}>
                    <FaEdit /> {errorMessage}
                </div>
            )}

            {isLoading ? (
                <div className="text-center" style={{ fontSize: "1.2em", color: "#007bff" }}>Loading hotel details...</div>
            ) : error ? (
                <div className="text-danger text-center">{error}</div>
            ) : (
                <div className="card" style={{
                    maxWidth: "600px", margin: "auto", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    backgroundColor: "#ffffff", border: "1px solid #dee2e6"
                }}>
                    <div className="card-body">
                        {hotelId && <h5 className="card-title mb-4 text-center text-primary"><FaHotel style={{ fontSize: "1.5em", marginRight: "10px" }} /> {hotelInfo.hotelName}</h5>}

                        <div className="form-group mb-3">
                            <label>Hotel ID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={hotelId || "N/A"}
                                readOnly
                                style={{
                                    backgroundColor: "#e9ecef", cursor: "not-allowed", color: "#6c757d", borderColor: "#ced4da",
                                    fontSize: "1.1em", padding: "12px 15px"
                                }}
                            />
                        </div>

                        {!isEditing ? (
                            <>
                                {hotelId ? (
                                    <>
                                        <p><FaMapMarkerAlt style={{ color: "#007bff", marginRight: "10px" }} /> <strong>Address:</strong> {hotelInfo.hotelAddress}</p>
                                        <p><FaCity style={{ color: "#28a745", marginRight: "10px" }} /> <strong>City:</strong> {hotelInfo.city}</p>
                                        <p><FaPhoneAlt style={{ color: "#ffc107", marginRight: "10px" }} /> <strong>Phone:</strong> {hotelInfo.phoneNumber}</p>
                                        <p><FaEnvelope style={{ color: "#6f42c1", marginRight: "10px" }} /> <strong>Email:</strong> {hotelInfo.email}</p>
                                    </>
                                ) : (
                                    <p><strong>New Hotel</strong></p>
                                )}
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-info mt-3"
                                    style={{
                                        backgroundColor: "#17a2b8", borderColor: "#17a2b8", color: "#fff", transition: "background-color 0.3s",
                                        padding: "10px 20px", borderRadius: "5px", fontSize: "1.1em"
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = "#138496"}
                                    onMouseOut={(e) => e.target.style.backgroundColor = "#17a2b8"}
                                >
                                    <FaEdit style={{ marginRight: "10px" }} /> {hotelId ? "Edit Details" : "Add Hotel"}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="form-group mb-3">
                                    <label>Hotel Name</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" style={{ backgroundColor: "#007bff", color: "#fff" }}>
                                                <FaHotel />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="hotelName"
                                            value={hotelInfo.hotelName}
                                            onChange={handleInputChange}
                                            style={{
                                                borderColor: "#007bff", padding: "12px 15px", fontSize: "1.1em"
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Hotel Address</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" style={{ backgroundColor: "#28a745", color: "#fff" }}>
                                                <FaMapMarkerAlt />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="hotelAddress"
                                            value={hotelInfo.hotelAddress}
                                            onChange={handleInputChange}
                                            style={{
                                                borderColor: "#28a745", padding: "12px 15px", fontSize: "1.1em"
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label>City</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" style={{ backgroundColor: "#ffc107", color: "#fff" }}>
                                                <FaCity />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="city"
                                            value={hotelInfo.city}
                                            onChange={handleInputChange}
                                            style={{
                                                borderColor: "#ffc107", padding: "12px 15px", fontSize: "1.1em"
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label>Phone Number</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" style={{ backgroundColor: "#6f42c1", color: "#fff" }}>
                                                <FaPhoneAlt />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phoneNumber"
                                            value={hotelInfo.phoneNumber}
                                            onChange={handleInputChange}
                                            style={{
                                                borderColor: "#6f42c1", padding: "12px 15px", fontSize: "1.1em"
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between mt-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="btn btn-secondary"
                                        style={{
                                            padding: "10px 20px", borderRadius: "5px", fontSize: "1.1em", backgroundColor: "#6c757d"
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="btn btn-success"
                                        style={{
                                            padding: "10px 20px", borderRadius: "5px", fontSize: "1.1em", backgroundColor: "#28a745"
                                        }}
                                    >
                                        <FaSave style={{ marginRight: "10px" }} /> Save
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default HotelProfile;
