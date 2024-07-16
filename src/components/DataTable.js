import React, { useState, useEffect } from "react";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = () => {
    setLoading(true);
    const apiUrl = `https://weon.yesbossyes.com/django/get_doctor_id?collection=sales_location_details&page`;
    const authToken =
      "05815aed2125937284b36c391e6617d1e6364664b8e7de594805073db25cf55495d4f65d55ff851b6564afdc9d4a7662f3ff2a4d4b1c35d80934967983b59b2d";

    fetch(apiUrl, {
      headers: {
        Authorization: authToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data && Array.isArray(data.document)) {
          setData(data.document);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const isDateInRange = (date) => {
    const parsedDate = new Date(date);
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    return (
      (!startDate || parsedDate >= parsedStartDate) &&
      (!endDate || parsedDate <= parsedEndDate)
    );
  };

  const filteredData = data
    .filter(
      (item) =>
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.phoneNumber &&
          item.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((item) => isDateInRange(item.date));

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <span
          key={i}
          style={{
            cursor: "pointer",
            fontSize: "20px",
            textDecoration: currentPage === i ? "underline" : "none",
            margin: "0 5px",
          }}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </span>
      );
    }
    return pages;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentImage("");
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <label>
            Search
            <input
              type="text"
              placeholder=" Type name or phone numb"
              value={searchTerm}
              onChange={handleSearch}
              style={{ padding: "5px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              style={{ padding: "5px",marginRight:'80px',fontFamily:'cursive'}}
            />
          </label>
          <label>
            End Date
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              style={{ padding: "5px", marginLeft: "10px",fontFamily:'cursive'}}
            />
          </label>
        </div>
        <div>
          <button
            onClick={fetchData}
            style={{
              cursor: "pointer",
              backgroundColor: "#3187A2",
              marginRight: "20px",
              width: "100px",
              height: "30px",
              marginTop: "20px",
              textDecoration: "none",
              borderRadius: "50px",
              color: "white",
            }}
          >
            Refresh
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table
            border="1"
            // cellSpacing="0"
            style={{ width: "100%", marginTop: "20px", backgroundColor: "lightgray" }}
          >
            <thead>
              <tr style={{backgroundColor:'#778899',fontSize:'18px',fontFamily:'cursive'}}>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.customerName}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>{item.locationCoordinates.latitude}</td>
                  <td>{item.locationCoordinates.longitude}</td>
                  <td>
                    {item.locationPhoto && (
                      <img
                        src={item.locationPhoto.media_url}
                        alt={`${item.customerName}`}
                        style={{ maxWidth: "150px", cursor: "pointer" }}
                        onClick={() => handleImageClick(item.locationPhoto.media_url)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "10px" }}>Pages: {renderPagination()}</div>
        </div>
      )}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt="Modal content"
              style={{ maxWidth: "90%", maxHeight: "80vh",}}
            />
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                backgroundColor: "teal",
                color: "white",
                border: "none",
                borderRadius: "30px",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
