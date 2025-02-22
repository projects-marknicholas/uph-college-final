import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Swal from "sweetalert2";
import EntranceApplicationFile from "./form/ea-file";

// API
import { insertEntranceApplication, fetchTypes } from '../../../../api/student';

const EntranceApplication = ({ studentTypeId, typeId }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState("");
  const [userId, setUserId] = useState(['']);
  const [curriculumYears, setCurriculumYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    academic_year: "",
    year_level: "1",
    semester: "1", 
    program: "",
    email_address: "",
    contact_number: "",
    honors_received: "",
    general_weighted_average: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isChecked, setIsChecked] = useState(true);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (!user) {
      console.error("User not found in session storage");
      return;
    }

    const userData = JSON.parse(user);
    setUserId(userData.user_id || '');

    setFormData((prevFormData) => ({
      ...prevFormData,
      email_address: userData.email || "",
      first_name: userData.first_name || "",
      middle_name: userData.middle_name || "",
      last_name: userData.last_name || "",
      department: userData.department || "",
      program: userData.program || "",
    }));
  }, []);

  useEffect(() => {
    const formatDate = () => {
      const date = new Date();
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      setCurrentDate(date.toLocaleString("en-US", options));
    };

    formatDate();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!typeId) return; 
  
      try {
        const response = await fetchTypes({ tid: typeId });
  
        if (response.status === "success") {
          setCurriculumYears(response.data || []);
          setSemesters(response.data || []);
        } else {
          console.error("Failed to fetch curriculum years:", response.message);
        }
      } catch (error) {
        console.error("Error fetching curriculum years:", error);
      }
    };
  
    fetchData();
  }, [typeId]); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isChecked) {
      Swal.fire("Warning!", "You must agree to the terms and conditions.", "warning");
      return;
    }

    // Call the insert function and pass the necessary data
    const response = await insertEntranceApplication({
      uid: userId,
      stid: studentTypeId,
      tid: typeId,
      formData,
    });

    if (response.status === "success") {
      Swal.fire('Success!', response.message, 'success');
      setFormData({
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        academic_year: "",
        year_level: "",
        semester: "1", 
        program: "",
        email_address: "",
        contact_number: "",
        honors_received: "",
        general_weighted_average: "",
      });
      setError(null);
      navigate('/student/applications');
    } else {
      Swal.fire('Error!', response.message, 'error');
      setMessage(null);
    }
  };

  return (
    <>
      <div className="popup-overlay">
        <div className="entrance-application">
          <div className="content">

            <div className="headers">
              <h1>SCHOLARSHIP PROGRAM</h1>
              <h3>ENTRANCE GRANT APPLICATION FORM</h3>
            </div>

            <div className="inputs">
              <div className="item">
                <span>Semester</span>
                <select
                  className="input"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  disabled
                >
                  {semesters.length ? (
                    semesters.map((sem) => (
                      <option key={sem.semester} value={sem.semester}>
                        {sem.semester === '1' ? "1st Semester" : sem.semester === '2' ? "2nd Semester" : sem.semester}
                      </option>
                    ))
                  ) : (
                    <option disabled>No available semesters</option>
                  )}
                </select>
              </div>
              <div className="item">
                <span>Academic Year</span>
                <select 
                  className="input"
                  id="academic_year"
                  name="academic_year"
                  value={formData.academic_year}
                  onChange={handleChange}
                  disabled
                > 
                  <option disabled>Select Academic Year</option>
                  {curriculumYears.map((year, index) => (
                    <option key={index} value={year.curriculum_year}>
                      {year.curriculum_year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="item">
                <span>First Name</span>
                <input
                  className="input"
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled
                  readOnly
                />
              </div>
              <div className="item">
                <span>Middle Name</span>
                <input
                  className="input"
                  type="text"
                  id="middle_name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  disabled
                  readOnly
                />
              </div>
              <div className="item">
                <span>Last Name</span>
                <input
                  className="input"
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled
                  readOnly
                />
              </div>
              <div className="item">
                <span>Course</span>
                <input
                  className="input"
                  type="text"
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  disabled
                  readOnly
                />
              </div>
              <div className="item">
                <span>E-mail Address</span>
                <input
                  className="input"
                  type="text"
                  id="email_address"
                  name="email_address"
                  value={formData.email_address}
                  onChange={handleChange}
                  disabled
                  readOnly
                />
              </div>
              <div className="item">
                <span>Contact Number</span>
                <input
                  className="input"
                  type="text"
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                />
              </div>
              <div className="item">
                <span>Honors Received</span>
                <input
                  className="input"
                  type="text"
                  id="honors_received"
                  name="honors_received"
                  value={formData.honors_received}
                  onChange={handleChange}
                />
              </div>
              <div className="item">
                <span>General Weighted Average (GWA)</span>
                <input
                  className="input"
                  type="text"
                  id="general_weighted_average"
                  name="general_weighted_average"
                  value={formData.general_weighted_average}
                  onChange={handleChange}
                />
              </div>
              <div className="item">
                <span>Date Applied</span>
                <div className="input">{currentDate}</div>
              </div>
            </div>

            <div className="privacy">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              /> "By signing this <b>entrance grant application form</b> you hereby allow / authorize UPH Calamba
              Campus and their authorized personnel to gather and process your personal information (name,
              address, and picture if applicable for documentation use) <b>specifically for scholarship program</b>.
              All information gathered on the said activity will be kept secured and confidential for a period of
              five (5) years from the collection date and will be destroyed by means of shredding and/or file deletion
              after the prescribed retention period in accordance with Republic Act 10173 of the Data Privacy Act of 2012
              of the Republic of the Philippines."
            </div>

            <div className="form-actions">
              <button onClick={handleSubmit}>Submit Application</button>&nbsp;
              <button type="button" onClick={() => setIsUploadPopupOpen(true)}>Add attachment</button>
            </div>

            {error && <div className="error">{error}</div>}
            {message && <div className="message">{message}</div>}
          </div>
        </div>

        {isUploadPopupOpen && (
          <EntranceApplicationFile 
            studentTypeId={studentTypeId} 
            typeId={typeId} 
            onClose={() => setIsUploadPopupOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default EntranceApplication;
