import { useState, useRef } from "react";
import { Edit3, Mail, Phone, User, Calendar, Heart, Flag, Camera, Upload } from "lucide-react";

// Mock employee data - replace with your actual data source
const mockEmployee = {
  firstName: "Surya",
  middleName: null,
  lastName: "C",
  displayName: "Surya C",
  gender: "Male",
  dateOfBirth: "20 Sept 2004",
  maritalStatus: null,
  physicallyHandicapped: "No",
  nationality: null,
  workEmail: "surya.c@cybersecurity-nxxt.com",
  personalEmail: "suryag.chinnathambi@gmail.com",
  phone: "+91 8870752656",
  workNumber: null,
  residenceNumber: null,
  emergencyNumber: null,
  profileImage: null,
};

interface ProfileModuleProps {
  employee?: typeof mockEmployee;
  onUpdate?: (data: any) => Promise<void>;
}

export function ProfileModule({ employee = mockEmployee, onUpdate }: ProfileModuleProps) {
  const [isEditingPrimary, setIsEditingPrimary] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(46);
  const [isAnimated, setIsAnimated] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(employee.profileImage);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [primaryData, setPrimaryData] = useState({
    firstName: employee.firstName,
    middleName: employee.middleName || "",
    lastName: employee.lastName,
    displayName: employee.displayName,
    gender: employee.gender,
    dateOfBirth: employee.dateOfBirth,
    maritalStatus: employee.maritalStatus || "",
    physicallyHandicapped: employee.physicallyHandicapped,
    nationality: employee.nationality || "",
  });

  const [contactData, setContactData] = useState({
    workEmail: employee.workEmail,
    personalEmail: employee.personalEmail,
    phone: employee.phone || "",
    workNumber: employee.workNumber || "",
    residenceNumber: employee.residenceNumber || "",
    emergencyNumber: employee.emergencyNumber || "",
  });

  useState(() => {
    setTimeout(() => setIsAnimated(true), 100);
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        if (onUpdate) {
          onUpdate({ profileImage: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (onUpdate) {
      onUpdate({ profileImage: null });
    }
    setIsEditingImage(false);
  };

  const handlePrimarySubmit = async () => {
    if (onUpdate) {
      await onUpdate(primaryData);
    }
    setIsEditingPrimary(false);
    // Update completion percentage
    const completedFields = Object.values(primaryData).filter(v => v && v !== "").length;
    const totalFields = Object.keys(primaryData).length;
    setProfileCompletion(Math.round((completedFields / totalFields) * 100));
  };

  const handleContactSubmit = async () => {
    if (onUpdate) {
      await onUpdate(contactData);
    }
    setIsEditingContact(false);
  };

  const FieldDisplay = ({ label, value, icon: Icon }: { label: string; value: string | null; icon?: any }) => (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500 mt-1" />}
      <div className="flex-1">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className={`text-sm ${value ? 'text-gray-200' : 'text-red-400 italic'}`}>
          {value || '-Not Set-'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-4 md:p-6 lg:p-8" style={{ fontFamily: "'Nexa', sans-serif" }}>
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/nexa-bold');
        
        .progress-bar-glow {
          box-shadow: 0 0 20px rgba(231, 76, 60, 0.6);
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          box-shadow: 0 0 20px rgba(39, 174, 96, 0.3);
          border-color: rgba(39, 174, 96, 0.5);
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-in;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Image Section */}
        <div className={`bg-[#1B263B] rounded-2xl shadow-xl p-6 border border-gray-800 ${isAnimated ? 'fade-in' : 'opacity-0'}`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-[#0D1B2A] border-4 border-[#27AE60] shadow-lg">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-600" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditingImage(true)}
                className="absolute bottom-0 right-0 bg-[#27AE60] hover:bg-[#229954] text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{employee.displayName}</h1>
              <p className="text-gray-400 flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-4 h-4" />
                {employee.workEmail}
              </p>
              <p className="text-gray-400 flex items-center gap-2 justify-center md:justify-start mt-1">
                <Phone className="w-4 h-4" />
                {employee.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Header Section - Profile Completion */}
        <div className={`bg-[#1B263B] rounded-2xl shadow-xl p-6 border border-gray-800 ${isAnimated ? 'fade-in' : 'opacity-0'}`}>
          <h2 className="text-2xl font-bold text-white mb-4">Incomplete Profile</h2>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Profile Completion</span>
              <span className="text-sm font-bold text-[#E74C3C]">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#E74C3C] to-[#C0392B] progress-bar-glow transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <span className="text-red-400">*</span>
            All fields marked in red color below are mandatory
          </p>
        </div>

        {/* Profile Details Section - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card - Primary Details */}
          <div className={`bg-[#1B263B] rounded-2xl shadow-xl border border-gray-800 card-hover ${isAnimated ? 'fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-[#27AE60]" />
                  Primary Details
                </h3>
                <button
                  onClick={() => setIsEditingPrimary(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldDisplay label="First Name" value={primaryData.firstName} />
                <FieldDisplay label="Middle Name" value={primaryData.middleName} />
                <FieldDisplay label="Last Name" value={primaryData.lastName} />
                <FieldDisplay label="Display Name" value={primaryData.displayName} />
                <FieldDisplay label="Gender" value={primaryData.gender} icon={User} />
                <FieldDisplay label="Date of Birth" value={primaryData.dateOfBirth} icon={Calendar} />
                <FieldDisplay label="Marital Status" value={primaryData.maritalStatus} icon={Heart} />
                <FieldDisplay label="Physically Handicapped" value={primaryData.physicallyHandicapped} />
                <FieldDisplay label="Nationality" value={primaryData.nationality} icon={Flag} />
              </div>
            </div>
          </div>

          {/* Right Card - Contact Details */}
          <div className={`bg-[#1B263B] rounded-2xl shadow-xl border border-gray-800 card-hover ${isAnimated ? 'fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#27AE60]" />
                    Contact Details
                  </h3>
                  <span className="px-3 py-1 bg-[#E74C3C] text-white text-xs font-bold rounded-full">
                    INCOMPLETE
                  </span>
                </div>
                <button
                  onClick={() => setIsEditingContact(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldDisplay label="Work Email" value={contactData.workEmail} icon={Mail} />
                <FieldDisplay label="Personal Email" value={contactData.personalEmail} icon={Mail} />
                <FieldDisplay label="Mobile Number" value={contactData.phone} icon={Phone} />
                <FieldDisplay label="Work Number" value={contactData.workNumber} icon={Phone} />
                <FieldDisplay label="Residence Number" value={contactData.residenceNumber} icon={Phone} />
                <FieldDisplay label="Emergency Number" value={contactData.emergencyNumber} icon={Phone} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Primary Details Modal */}
      {isEditingPrimary && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1B263B] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Edit Primary Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">First Name</label>
                    <input
                      type="text"
                      value={primaryData.firstName}
                      onChange={(e) => setPrimaryData({...primaryData, firstName: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Middle Name</label>
                    <input
                      type="text"
                      value={primaryData.middleName}
                      onChange={(e) => setPrimaryData({...primaryData, middleName: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={primaryData.lastName}
                      onChange={(e) => setPrimaryData({...primaryData, lastName: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={primaryData.displayName}
                      onChange={(e) => setPrimaryData({...primaryData, displayName: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Gender</label>
                    <select
                      value={primaryData.gender}
                      onChange={(e) => setPrimaryData({...primaryData, gender: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Date of Birth</label>
                    <input
                      type="text"
                      value={primaryData.dateOfBirth}
                      onChange={(e) => setPrimaryData({...primaryData, dateOfBirth: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Marital Status</label>
                    <select
                      value={primaryData.maritalStatus}
                      onChange={(e) => setPrimaryData({...primaryData, maritalStatus: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    >
                      <option value="">-Not Set-</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nationality</label>
                    <input
                      type="text"
                      value={primaryData.nationality}
                      onChange={(e) => setPrimaryData({...primaryData, nationality: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsEditingPrimary(false)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePrimarySubmit}
                    className="px-6 py-3 bg-[#27AE60] hover:bg-[#229954] text-white rounded-lg transition-all duration-200 font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Details Modal */}
      {isEditingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1B263B] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Edit Contact Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Work Email</label>
                    <input
                      type="email"
                      value={contactData.workEmail}
                      onChange={(e) => setContactData({...contactData, workEmail: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Personal Email</label>
                    <input
                      type="email"
                      value={contactData.personalEmail}
                      onChange={(e) => setContactData({...contactData, personalEmail: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={contactData.phone}
                      onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Work Number</label>
                    <input
                      type="tel"
                      value={contactData.workNumber}
                      onChange={(e) => setContactData({...contactData, workNumber: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Residence Number</label>
                    <input
                      type="tel"
                      value={contactData.residenceNumber}
                      onChange={(e) => setContactData({...contactData, residenceNumber: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Emergency Number</label>
                    <input
                      type="tel"
                      value={contactData.emergencyNumber}
                      onChange={(e) => setContactData({...contactData, emergencyNumber: e.target.value})}
                      className="w-full p-3 bg-[#0D1B2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#27AE60] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsEditingContact(false)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleContactSubmit}
                    className="px-6 py-3 bg-[#27AE60] hover:bg-[#229954] text-white rounded-lg transition-all duration-200 font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Image Modal */}
      {isEditingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1B263B] rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Update Profile Picture</h3>
              
              <div className="space-y-6">
                {/* Preview */}
                <div className="flex justify-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-[#0D1B2A] border-4 border-[#27AE60]">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-20 h-20 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#27AE60] hover:bg-[#229954] text-white rounded-lg transition-all duration-200 font-semibold"
                >
                  <Upload className="w-5 h-5" />
                  {profileImage ? 'Change Photo' : 'Upload Photo'}
                </button>

                {/* Remove Button */}
                {profileImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-semibold"
                  >
                    Remove Photo
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setIsEditingImage(false)}
                  className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
                >
                  Close
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}