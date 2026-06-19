import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { User, Phone, MapPin, Briefcase, GraduationCap, Code, Globe, Linkedin, Github, FileText, CheckCircle2 } from 'lucide-react';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useNotifications();
  const [loading, setLoading] = useState(false);

  const initialProfile = user?.profile || {
    fullName: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    city: '',
    country: '',
    qualification: '',
    experience: '',
    skills: [],
    languages: '',
    linkedin: '',
    github: '',
    portfolio: '',
    resumeText: ''
  };

  const [formData, setFormData] = useState(initialProfile);
  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (formData.skills.includes(skillInput.trim())) return;
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()]
    }));
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      showToast('success', 'Profile Updated', 'Your professional bio was successfully updated.');
    } catch (err) {
      showToast('error', 'Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile completion card */}
      <div className="glass-card p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200/50 dark:border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gradient-to-tr from-brand-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl uppercase shadow-md">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{formData.fullName || user?.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role} Account - {user?.email}</p>
          </div>
        </div>
        
        {/* Completion Progress bar */}
        <div className="w-full md:w-64">
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">Profile Completion</span>
            <span className="text-brand-600 dark:text-brand-400">{user?.profile?.profileCompletion || 15}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 transition-all duration-500"
              style={{ width: `${user?.profile?.profileCompletion || 15}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bio Sections */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/50 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Personal Information
            </h3>
            
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 019-2834"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field text-xs pr-8"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Education & Experience */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/50 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Professional Credentials
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Highest Qualification</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="B.Sc. Computer Science"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Years of Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="3 years"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Languages</label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="English, Spanish"
                className="input-field"
              />
            </div>

            {/* Portfolios */}
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pt-2 pb-2">
              Online Profiles
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">GitHub URL</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Portfolio Website</label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://myportfolio.dev"
                className="input-field text-xs"
              />
            </div>
          </div>
        </div>

        {/* Skills & Resume Upload */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/50 dark:border-slate-800/80">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Skills Inventory & Bio Details
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Add Key Skills</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g. React JS, SQL, Docker"
                className="input-field"
              />
              <button onClick={addSkill} className="btn-secondary whitespace-nowrap">
                Add Skill
              </button>
            </div>
            
            {/* Skills chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-400 text-xs font-semibold rounded-lg border border-brand-200/30"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
              {formData.skills.length === 0 && (
                <span className="text-xs text-slate-400">No skills added yet.</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Resume Copy (Plain Text / Bio Summary)</label>
            <textarea
              name="resumeText"
              value={formData.resumeText}
              onChange={handleChange}
              rows={4}
              placeholder="Copy paste your work history resume text here. The AI chatbot can read this text block to write cover letters on the spot."
              className="input-field text-xs font-mono"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-primary py-3 px-8 font-bold text-sm">
            {loading ? 'Saving updates...' : 'Save Profile Details'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
