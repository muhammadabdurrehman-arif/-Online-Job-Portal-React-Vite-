import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  updatePersonalInfo,
  updateSummary,
  addListItem,
  removeListItem,
  updateListItem,
  setTemplate,
  loadResume
} from '../../store/resumeSlice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileText, Download, Printer, RefreshCw, Plus, Trash2, Eye, LayoutTemplate, Briefcase, GraduationCap, Code, Award, FolderGit2 } from 'lucide-react';

export const ResumeBuilder = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const dispatch = useDispatch();
  
  const resume = useSelector(state => state.resume);
  const previewRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('personal'); // 'personal'|'summary'|'experience'|'education'|'skills'|'projects'|'certs'
  const [downloading, setDownloading] = useState(false);

  // Auto save simulation
  useEffect(() => {
    localStorage.setItem('cc_saved_resume', JSON.stringify(resume));
  }, [resume]);

  // Load saved resume if any, otherwise prefill from profile
  const prefillFromProfile = () => {
    if (!user) return;
    const profile = user.profile;
    dispatch(loadResume({
      personalInfo: {
        fullName: profile.fullName || user.name,
        title: profile.qualification || 'Software Engineer',
        email: profile.email || user.email,
        phone: profile.phone || '',
        address: `${profile.city || ''}, ${profile.country || ''}`,
        website: profile.portfolio || '',
        github: profile.github || '',
        linkedin: profile.linkedin || ''
      },
      summary: profile.resumeText || 'Detail-oriented professional with passion for software engineering and problem solving.',
      skills: profile.skills || [],
      education: [],
      experience: [],
      projects: [],
      certifications: []
    }));
    showToast('success', 'Profile Prefill', 'Imported profile metrics successfully.');
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePersonalInfo({ [name]: value }));
  };

  const handleSummaryChange = (e) => {
    dispatch(updateSummary(e.target.value));
  };

  const addListSectionItem = (section, emptyItem) => {
    dispatch(addListItem({ section, item: emptyItem }));
  };

  const removeListSectionItem = (section, index) => {
    dispatch(removeListItem({ section, index }));
  };

  const updateListSectionItem = (section, index, field, value) => {
    dispatch(updateListItem({ section, index, item: { [field]: value } }));
  };

  // PDF Download Action
  const downloadPdf = async () => {
    setDownloading(true);
    showToast('info', 'Compiling PDF', 'Generating ATS-Friendly layout. Please wait...');
    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 Width
      const pageHeight = 295; // A4 Height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      showToast('success', 'Download Complete', 'ATS-Friendly PDF downloaded successfully.');
    } catch (err) {
      showToast('error', 'Export Error', 'Could not compile preview to PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Preview Layout Template Builders
  const renderTemplatePreview = () => {
    const p = resume.personalInfo;
    const s = resume.summary;
    const edu = resume.education;
    const exp = resume.experience;
    const proj = resume.projects;
    const sks = resume.skills;
    const cert = resume.certifications;

    // Professional layout template
    if (resume.activeTemplate === 'Professional') {
      return (
        <div className="bg-white text-slate-950 p-8 font-sans min-h-[840px] text-left leading-relaxed text-xs">
          <div className="border-b-2 border-brand-800 pb-4 mb-5 text-center">
            <h1 className="text-2xl font-bold text-slate-900 tracking-wide uppercase">{p.fullName || 'Full Name'}</h1>
            <h2 className="text-sm font-semibold text-brand-700 uppercase tracking-wider mt-1">{p.title || 'Professional Title'}</h2>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-slate-500 text-[10px]">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.address && <span>{p.address}</span>}
              {p.website && <span>{p.website}</span>}
              {p.github && <span>{p.github}</span>}
              {p.linkedin && <span>{p.linkedin}</span>}
            </div>
          </div>

          {s && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-brand-800 border-b border-slate-200 pb-1 uppercase tracking-wide">Professional Summary</h3>
              <p className="mt-2 leading-relaxed text-slate-700">{s}</p>
            </div>
          )}

          {exp.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-brand-800 border-b border-slate-200 pb-1 uppercase tracking-wide">Work Experience</h3>
              <div className="space-y-4 mt-2">
                {exp.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{item.role} - {item.company}</span>
                      <span className="text-[10px] text-slate-500">{item.startDate} — {item.endDate}</span>
                    </div>
                    <p className="mt-1 text-slate-700 whitespace-pre-line leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {edu.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-brand-800 border-b border-slate-200 pb-1 uppercase tracking-wide">Education</h3>
              <div className="space-y-3 mt-2">
                {edu.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900">{item.degree}</span>, {item.school}
                      {item.gpa && <span className="text-[10px] text-slate-500 block">GPA: {item.gpa}</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">{item.startYear} — {item.endYear}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {proj.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-brand-800 border-b border-slate-200 pb-1 uppercase tracking-wide">Projects</h3>
              <div className="space-y-3 mt-2">
                {proj.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{item.title}</span>
                      {item.link && <span className="text-[10px] text-brand-600 font-normal">{item.link}</span>}
                    </div>
                    <p className="mt-1 text-slate-700 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sks.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-brand-800 border-b border-slate-200 pb-1 uppercase tracking-wide">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {sks.map((skill, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded text-[10px] font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cert.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-brand-800 border-b border-slate-200 pb-1 uppercase tracking-wide">Certifications</h3>
              <ul className="list-disc list-inside space-y-1 mt-2 text-slate-700">
                {cert.map((item, idx) => (
                  <li key={idx}>
                    <span className="font-bold">{item.title}</span> — {item.issuer} ({item.year})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    // Modern layout template
    if (resume.activeTemplate === 'Modern') {
      return (
        <div className="bg-slate-50 text-slate-800 font-sans min-h-[840px] text-left leading-relaxed text-xs flex">
          {/* Sidebar */}
          <div className="w-1/3 bg-slate-900 text-white p-6 flex flex-col gap-6">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wider">{p.fullName || 'Full Name'}</h1>
              <p className="text-[10px] text-brand-400 font-semibold uppercase tracking-widest mt-1">{p.title || 'Title'}</p>
            </div>
            
            <div className="space-y-2 text-[10px] text-slate-300">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-1">Contact</h3>
              <p className="truncate">{p.email}</p>
              <p>{p.phone}</p>
              <p className="whitespace-pre-line">{p.address}</p>
              {p.website && <p className="truncate">{p.website}</p>}
              {p.github && <p className="truncate">{p.github}</p>}
            </div>

            {sks.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-1">Skills</h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sks.map((skill, idx) => (
                    <span key={idx} className="bg-slate-800 text-brand-300 px-2 py-0.5 rounded text-[9px] font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Body */}
          <div className="flex-1 bg-white p-8 flex flex-col gap-6">
            {s && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Summary</h3>
                <p className="mt-2 text-slate-600 leading-normal">{s}</p>
              </div>
            )}

            {exp.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Experience</h3>
                <div className="space-y-4 mt-2">
                  {exp.map((item, idx) => (
                    <div key={idx} className="relative pl-4 border-l border-slate-200">
                      <span className="absolute -left-1 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{item.role}</span>
                        <span className="text-[9px] text-slate-400 font-normal">{item.startDate} — {item.endDate}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">{item.company}</p>
                      <p className="mt-1.5 text-slate-600 leading-relaxed whitespace-pre-line">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {edu.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Education</h3>
                <div className="space-y-3 mt-2">
                  {edu.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{item.degree}</span>
                        <span className="text-[9px] text-slate-400 font-normal">{item.startYear} — {item.endYear}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">{item.school} {item.gpa && `| GPA: ${item.gpa}`}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ATS-Friendly layout template (simple single-column formatting, highly parseable)
    if (resume.activeTemplate === 'ATS-Friendly') {
      return (
        <div className="bg-white text-slate-950 p-10 font-mono min-h-[840px] text-left leading-normal text-[11px]">
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold uppercase">{p.fullName || 'Candidate Name'}</h1>
            <p className="mt-1">
              {[p.email, p.phone, p.address, p.website, p.github, p.linkedin].filter(Boolean).join(' | ')}
            </p>
          </div>

          {s && (
            <div className="mb-4">
              <h3 className="font-bold border-b border-black uppercase">Summary</h3>
              <p className="mt-1">{s}</p>
            </div>
          )}

          {exp.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold border-b border-black uppercase">Work Experience</h3>
              <div className="space-y-3 mt-1">
                {exp.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between font-bold">
                      <span>{item.company} — {item.role}</span>
                      <span>{item.startDate} to {item.endDate}</span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap leading-relaxed text-slate-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {edu.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold border-b border-black uppercase">Education</h3>
              <div className="space-y-2 mt-1">
                {edu.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.degree} | {item.school} {item.gpa && `(GPA: ${item.gpa})`}</span>
                    <span>{item.startYear} to {item.endYear}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sks.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold border-b border-black uppercase">Skills</h3>
              <p className="mt-1">{sks.join(', ')}</p>
            </div>
          )}

          {cert.length > 0 && (
            <div>
              <h3 className="font-bold border-b border-black uppercase">Certifications</h3>
              <p className="mt-1">
                {cert.map(c => `${c.title} (${c.issuer}, ${c.year})`).join(' | ')}
              </p>
            </div>
          )}
        </div>
      );
    }

    // Executive layout template
    return (
      <div className="bg-[#fcfbf7] text-slate-900 p-8 font-serif min-h-[840px] text-left leading-relaxed text-xs">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-normal text-slate-900 tracking-wide uppercase italic">{p.fullName || 'Candidate Name'}</h1>
          <p className="text-[10px] tracking-widest text-slate-500 uppercase mt-1">— {p.title || 'Professional Title'} —</p>
          <div className="flex flex-wrap justify-center gap-x-4 mt-3 text-[9px] text-slate-400">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.address && <span>{p.address}</span>}
            {p.linkedin && <span>{p.linkedin}</span>}
          </div>
        </div>

        {s && (
          <div className="mb-5">
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 tracking-wider italic">Professional Statement</h3>
            <p className="mt-1.5 text-slate-700 italic leading-relaxed">{s}</p>
          </div>
        )}

        {exp.length > 0 && (
          <div className="mb-5">
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 tracking-wider italic">Leadership & Accomplishments</h3>
            <div className="space-y-4 mt-2">
              {exp.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span className="italic">{item.role}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{item.startDate} — {item.endDate}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{item.company}</p>
                  <p className="mt-1 text-slate-700 whitespace-pre-line leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {edu.length > 0 && (
          <div className="mb-5">
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 tracking-wider italic">Academic Background</h3>
            <div className="space-y-3 mt-2">
              {edu.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900">{item.degree}</span>, {item.school}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.startYear} — {item.endYear}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sks.length > 0 && (
          <div>
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-0.5 tracking-wider italic">Competencies</h3>
            <p className="mt-1.5 text-slate-700 leading-normal">{sks.join(' • ')}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and top widgets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Resume Builder & PDF Exporter
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Build, structure, and export ATS-friendly resumes on-the-fly. Auto-saves changes to local states.
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={prefillFromProfile} className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 font-bold">
            <RefreshCw className="h-3.5 w-3.5" /> Prefill from Profile
          </button>
          <button onClick={handlePrint} className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 font-bold">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
          <button
            onClick={downloadPdf}
            disabled={downloading}
            className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 font-bold shadow-md hover:shadow-lg"
          >
            {downloading ? (
              <span className="h-3.5 w-3.5 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Download className="h-3.5 w-3.5" /> Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Editor Form Panels */}
        <div className="lg:col-span-5 flex flex-col glass-card rounded-3xl overflow-hidden min-h-[500px] border border-slate-200/50 dark:border-slate-800/80">
          {/* Navigation tab strip */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'personal', label: 'Contact', icon: <FileText className="h-3.5 w-3.5" /> },
              { id: 'summary', label: 'Bio', icon: <FileText className="h-3.5 w-3.5" /> },
              { id: 'experience', label: 'Work', icon: <Briefcase className="h-3.5 w-3.5" /> },
              { id: 'education', label: 'Education', icon: <GraduationCap className="h-3.5 w-3.5" /> },
              { id: 'skills', label: 'Skills', icon: <Code className="h-3.5 w-3.5" /> },
              { id: 'projects', label: 'Projects', icon: <FolderGit2 className="h-3.5 w-3.5" /> },
              { id: 'certs', label: 'Certs', icon: <Award className="h-3.5 w-3.5" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content panel details */}
          <div className="p-6 flex-1 max-h-[480px] overflow-y-auto no-scrollbar">
            {/* 1. Contact Form */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">Personal Details</h3>
                
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={resume.personalInfo.fullName}
                    onChange={handlePersonalChange}
                    className="input-field text-xs"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Target Title</label>
                  <input
                    type="text"
                    name="title"
                    value={resume.personalInfo.title}
                    onChange={handlePersonalChange}
                    className="input-field text-xs"
                    placeholder="Senior React Developer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={resume.personalInfo.email}
                      onChange={handlePersonalChange}
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={resume.personalInfo.phone}
                      onChange={handlePersonalChange}
                      className="input-field text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Address / Location</label>
                  <input
                    type="text"
                    name="address"
                    value={resume.personalInfo.address}
                    onChange={handlePersonalChange}
                    className="input-field text-xs"
                    placeholder="San Francisco, CA (or Remote)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">GitHub URL</label>
                    <input
                      type="text"
                      name="github"
                      value={resume.personalInfo.github}
                      onChange={handlePersonalChange}
                      className="input-field text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      name="linkedin"
                      value={resume.personalInfo.linkedin}
                      onChange={handlePersonalChange}
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">Professional Summary</h3>
                <textarea
                  value={resume.summary}
                  onChange={handleSummaryChange}
                  rows={8}
                  placeholder="Detail your technical leadership, major achievements, and core competencies..."
                  className="input-field text-xs leading-normal"
                />
              </div>
            )}

            {/* 3. Work Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Work History</h3>
                  <button
                    onClick={() => addListSectionItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })}
                    className="p-1 text-xs text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-850 rounded flex items-center gap-1 font-bold"
                  >
                    <Plus className="h-4 w-4" /> Add job
                  </button>
                </div>

                <div className="space-y-6">
                  {resume.experience.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl space-y-3 relative">
                      <button
                        onClick={() => removeListSectionItem('experience', idx)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Company</label>
                          <input
                            type="text"
                            value={item.company}
                            onChange={(e) => updateListSectionItem('experience', idx, 'company', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Role</label>
                          <input
                            type="text"
                            value={item.role}
                            onChange={(e) => updateListSectionItem('experience', idx, 'role', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Start Date</label>
                          <input
                            type="text"
                            value={item.startDate}
                            onChange={(e) => updateListSectionItem('experience', idx, 'startDate', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                            placeholder="Jan 2024"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">End Date</label>
                          <input
                            type="text"
                            value={item.endDate}
                            onChange={(e) => updateListSectionItem('experience', idx, 'endDate', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                            placeholder="Present"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Key Responsibilities</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateListSectionItem('experience', idx, 'description', e.target.value)}
                          rows={3}
                          className="input-field py-1.5 px-3 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                  {resume.experience.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-6">No experience blocks added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* 4. Education */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Education History</h3>
                  <button
                    onClick={() => addListSectionItem('education', { school: '', degree: '', startYear: '', endYear: '', gpa: '' })}
                    className="p-1 text-xs text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-850 rounded flex items-center gap-1 font-bold"
                  >
                    <Plus className="h-4 w-4" /> Add degree
                  </button>
                </div>

                <div className="space-y-6">
                  {resume.education.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl space-y-3 relative">
                      <button
                        onClick={() => removeListSectionItem('education', idx)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">School/Uni</label>
                          <input
                            type="text"
                            value={item.school}
                            onChange={(e) => updateListSectionItem('education', idx, 'school', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Degree</label>
                          <input
                            type="text"
                            value={item.degree}
                            onChange={(e) => updateListSectionItem('education', idx, 'degree', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Start Year</label>
                          <input
                            type="text"
                            value={item.startYear}
                            onChange={(e) => updateListSectionItem('education', idx, 'startYear', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">End Year</label>
                          <input
                            type="text"
                            value={item.endYear}
                            onChange={(e) => updateListSectionItem('education', idx, 'endYear', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">GPA (optional)</label>
                          <input
                            type="text"
                            value={item.gpa}
                            onChange={(e) => updateListSectionItem('education', idx, 'gpa', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                            placeholder="3.8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {resume.education.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-6">No education blocks added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* 5. Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2">Technical Skills</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/50 dark:border-slate-800 text-xs">
                  <p className="text-slate-500 dark:text-slate-400">
                    Your skills lists are dynamically synced with your Profile settings to provide optimal matching ratios. Update skills on your Profile Page to modify this list.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {resume.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-brand-100 text-brand-850 dark:bg-brand-900/40 dark:text-brand-300 font-bold rounded-lg">
                        {skill}
                      </span>
                    ))}
                    {resume.skills.length === 0 && (
                      <span className="text-rose-500 font-bold">No skills configured! Please prefill from your Profile.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 6. Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Portfolio Projects</h3>
                  <button
                    onClick={() => addListSectionItem('projects', { title: '', description: '', link: '' })}
                    className="p-1 text-xs text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-850 rounded flex items-center gap-1 font-bold"
                  >
                    <Plus className="h-4 w-4" /> Add project
                  </button>
                </div>

                <div className="space-y-6">
                  {resume.projects.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl space-y-3 relative">
                      <button
                        onClick={() => removeListSectionItem('projects', idx)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateListSectionItem('projects', idx, 'title', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">URL Link</label>
                          <input
                            type="text"
                            value={item.link}
                            onChange={(e) => updateListSectionItem('projects', idx, 'link', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                            placeholder="github.com/..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Project Summary</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateListSectionItem('projects', idx, 'description', e.target.value)}
                          rows={3}
                          className="input-field py-1.5 px-3 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                  {resume.projects.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-6">No projects added yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* 7. Certifications */}
            {activeTab === 'certs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Credentials & Badges</h3>
                  <button
                    onClick={() => addListSectionItem('certifications', { title: '', issuer: '', year: '' })}
                    className="p-1 text-xs text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-850 rounded flex items-center gap-1 font-bold"
                  >
                    <Plus className="h-4 w-4" /> Add credential
                  </button>
                </div>

                <div className="space-y-6">
                  {resume.certifications.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl space-y-3 relative">
                      <button
                        onClick={() => removeListSectionItem('certifications', idx)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateListSectionItem('certifications', idx, 'title', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Year</label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => updateListSectionItem('certifications', idx, 'year', e.target.value)}
                            className="input-field py-1.5 px-3 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Issuer</label>
                        <input
                          type="text"
                          value={item.issuer}
                          onChange={(e) => updateListSectionItem('certifications', idx, 'issuer', e.target.value)}
                          className="input-field py-1.5 px-3 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                  {resume.certifications.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-6">No credentials added yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Preview Panel */}
        <div className="lg:col-span-7 space-y-4">
          {/* Template switching controls */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-sm flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <LayoutTemplate className="h-4 w-4" /> Switch Format
            </span>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {['Professional', 'Modern', 'ATS-Friendly', 'Executive'].map(tmpl => (
                <button
                  key={tmpl}
                  onClick={() => dispatch(setTemplate(tmpl))}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    resume.activeTemplate === tmpl
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {tmpl}
                </button>
              ))}
            </div>
          </div>

          {/* Actual preview sheet container */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
            <div ref={previewRef} className="w-[800px] mx-auto scale-95 origin-top min-w-[800px]">
              {renderTemplatePreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
