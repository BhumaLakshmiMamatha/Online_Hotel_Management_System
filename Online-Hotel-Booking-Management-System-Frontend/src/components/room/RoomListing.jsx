import React from "react"
import Room from "./Room"
import { useParams } from "react-router-dom"
const RoomListing = () => {
	const { hotelId } = useParams()
	return (
		<section className="bg-light p-2 mb-5  shadow">
			<Room hotelId={hotelId} />
		</section>
	)
}

export default RoomListing
