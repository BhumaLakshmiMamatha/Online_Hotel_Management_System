import React, { useState } from "react"
import RoomCard from "../room/RoomCard"
import { Button, Row } from "react-bootstrap"
import RoomPaginator from "./RoomPaginator"

const RoomSearchResults = ({ results, onClearSearch }) => {
	const [currentPage, setCurrentPage] = useState(1)
	const resultsPerPage = 3
	const totalResults = results.length
	const totalPages = Math.ceil(totalResults / resultsPerPage)

	console.log(results)
	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	const startIndex = (currentPage - 1) * resultsPerPage
	const endIndex = startIndex + resultsPerPage
	const paginatedResults = results.slice(startIndex, endIndex)

	return (
		<>
			{results.length > 0 ? (
				<>
					<h5 className="text-center mt-5 fs-4 text-danger">Search Results</h5>
					<Row>
						{paginatedResults.map((room) => (
							<RoomCard key={room.id} room={room} />
						))}
					</Row>
					<Row>
						{totalResults > resultsPerPage && (
							<RoomPaginator
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						)}
						<div className="d-flex justify-content-center mt-3 w-100">

						<Button variant="secondary w-50 " onClick={onClearSearch}>
							Clear Search
						</Button>
						</div>
					</Row>
				</>
			) : (
				<p></p>
			)}
		</>
	)
}

export default RoomSearchResults
