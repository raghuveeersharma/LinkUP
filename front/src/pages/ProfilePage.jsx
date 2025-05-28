import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import {
  CameraIcon,
  Edit,
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { LANGUAGES } from "../constants";
import useOnboarding from "../hooks/useOnboarding";
import useDelete from "../hooks/useDelete";

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  // Fetching user data from auth hook
  const { authUser } = useAuthUser();
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });
  const { isPending, onboardingMutation } = useOnboarding(); // Custom hook for onboarding mutation
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  // RANDOM AVATAR
  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; //1 to 100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Avatar Changed Successfully");
  };

  const { deleteMutation, isPending: deletePending } = useDelete();
  const handleDelete = (e) => {
    e.preventDefault();
    const confirm = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirm) return;
    const reConfirm = window.confirm(
      "Deleting your profile will remove all your data permanently."
    );
    if (!reConfirm) return;
    deleteMutation();
    toast.success("Profile Deleted Successfully");
  };
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center gap-3 w-full mb-4">
                <span>
                  {editMode ? (
                    <X
                      className="size-5 text-base-content opacity-70"
                      onClick={() => setEditMode(!editMode)}
                    />
                  ) : (
                    <Edit
                      className="size-5 text-base-content opacity-70"
                      onClick={() => setEditMode(!editMode)}
                    />
                  )}
                </span>
                <span disabled={deletePending}>
                  <Trash2
                    className="size-5 text-base-content opacity-70"
                    onClick={handleDelete}
                  />
                </span>
              </div>
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Generate Random Avatar BTN */}
              <div className="flex items-center gap-2">
                {editMode ? (
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-accent"
                  >
                    <ShuffleIcon className="size-4 mr-2" />
                    Generate New Random Avatar
                  </button>
                ) : (
                  <button type="button" className="btn btn-accent">
                    Your Avatar
                  </button>
                )}
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                readOnly={!editMode}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                readOnly={!editMode}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                {editMode ? (
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        nativeLanguage: e.target.value,
                      })
                    }
                    readOnly={!editMode}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="input input-bordered w-full">
                    {formState.nativeLanguage}
                  </div>
                )}
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                {editMode ? (
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option
                        key={`learning-${lang}`}
                        value={lang.toLowerCase()}
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="input input-bordered w-full">
                    {formState.learningLanguage}
                  </div>
                )}
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  readOnly={!editMode}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}

            {editMode && (
              <button
                className="btn btn-primary w-full"
                disabled={isPending}
                type="submit"
              >
                {!isPending ? (
                  <>
                    <ShipWheelIcon className="size-5 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Saving...
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
