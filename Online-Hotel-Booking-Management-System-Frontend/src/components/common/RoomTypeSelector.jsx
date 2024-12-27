import React, { useState, useEffect } from "react";
import { getRoomTypes } from "../utils/ApiFunctions";

const RoomTypeSelector = ({ handleRoomInputChange, newRoom }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoomType, setNewRoomType] = useState("");
  const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false);

  useEffect(() => {
    getRoomTypes().then((data) => {
      setRoomTypes(data);
    });
  }, []);

  const handleNewRoomTypeInputChange = (e) => {
    setNewRoomType(e.target.value);
  };

  const handleAddNewRoomType = () => {
    if (newRoomType.trim() !== "") {
      const updatedRoomTypes = [...roomTypes, newRoomType];
      setRoomTypes(updatedRoomTypes);
      setNewRoomType("");
      setShowNewRoomTypeInput(false);
      handleRoomInputChange({ target: { name: "roomType", value: newRoomType } });
    }
  };

  const handleRoomTypeSelection = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "Add New") {
      setShowNewRoomTypeInput(true);
    } else {
      setShowNewRoomTypeInput(false);
      handleRoomInputChange(e); // Pass selected value to parent handler
    }
  };

  return (
    <div className="room-type-selector mt-4">
      <select
        required
        className="form-select text-center text-secondary"
        name="roomType"
        onChange={handleRoomTypeSelection}
        value={newRoom.roomType}
        style={{ height: "62px" }}
      >
        <option value="">Select a room type</option>
        {roomTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
        <option value="Add New">Add New</option>
      </select>

      {showNewRoomTypeInput && (
        <div className="mt-3">
          <div className="input-group" style={{ height: "60px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter New Room Type"
              value={newRoomType}
              onChange={handleNewRoomTypeInputChange}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleAddNewRoomType}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypeSelector;
