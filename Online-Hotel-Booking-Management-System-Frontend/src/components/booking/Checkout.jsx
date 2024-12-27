import React, { useEffect, useState } from "react";
import BookingForm from "../booking/BookingForm";
import {
  FaUtensils,
  FaWifi,
  FaTv,
  FaWineGlassAlt,
  FaParking,
  FaCar,
  FaTshirt,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getRoomById } from "../utils/ApiFunctions";
import RoomCarousel from "../common/RoomCarousel";
import './Checkout.css'


const Checkout = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState({
    photo: "",
    roomType: "",
    roomPrice: "",
  });

  const { roomId, hotelId } = useParams();

  useEffect(() => {
    setTimeout(() => {
      getRoomById(roomId)
        .then((response) => {
          setRoomInfo(response);
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error);
          setIsLoading(false);
        });
    }, 1000);
  }, [roomId]);

  return (
    <div>
      <section className="container mt-5">
        <div className="row">
          {/* Room Information Section */}
          <div className="col-md-4 mb-5">
            {isLoading ? (
              <div className="text-center">
                <div className=" text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <p className="text-center text-danger">{error}</p>
            ) : (
              <div className="room-info shadow-lg rounded p-4 bg-white" style={{height:'600px'}}>  
                <img
                  src={`data:image/png;base64,${roomInfo.photo}`}
                  alt="Room photo"
                  className="img-fluid rounded mb-4 custom-image" // img-fluid makes the image responsive
                />
                <h4 className="text-center mb-2">{roomInfo.roomType}</h4>
                <div className="mb-2 text-center">
                  <h5>
                    <strong>₹ {roomInfo.roomPrice}</strong> per night
                  </h5>
                </div>
                <table className="table table-bordered table-striped table-hover custom-table">
                  <tbody>
                    <tr>
                      <th>Room Service:</th>
                      <td>
                        <ul className="list-unstyled mb-0">
                          <li className="service-item">
                            <FaWifi className="text-info" /> Wifi
                          </li>
                          <li className="service-item">
                            <FaTv className="text-dark" /> Netflix Premium
                          </li>
                          <li className="service-item">
                            <FaUtensils className="text-warning" /> Breakfast
                          </li>
                          <li className="service-item">
                            <FaWineGlassAlt className="text-danger" /> Mini Bar
                            Refreshment
                          </li>
                          <li className="service-item">
                            <FaCar className="text-success" /> Car Service
                          </li>
                          <li className="service-item">
                            <FaParking className="text-secondary" /> Parking
                            Space
                          </li>
                          <li className="service-item">
                            <FaTshirt className="text-muted" /> Laundry
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Booking Form Section */}
          <div className="col-md-8 booking-form shadow-lg m-0 bg-white rounded  d-flex align-items-center justify-content-center"style={{height:'600px'}}>
            <div className="">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Room Carousel Section */}
      <div className="container mt-5 my-5 ">
        <RoomCarousel hotelId={hotelId} />
      </div>
    </div>
  );
};

export default Checkout;
