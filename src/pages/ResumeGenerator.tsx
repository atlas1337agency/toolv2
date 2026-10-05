import React, { useState, useEffect, useRef } from "react";
import { Document, Page, Text, View, StyleSheet, usePDF, Image, Link } from "@react-pdf/renderer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storage } from "@/services/storage";
import { motion, AnimatePresence } from "motion/react";
import { ProjectManager } from "@/components/ProjectManager";
import { Loader2, Plus, Trash2, Eye, Edit3, ChevronDown, ChevronUp, AlertCircle, Lightbulb, Download } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

// --- PDF Styles ---
const styles = StyleSheet.create({
  page: { flexDirection: "column", backgroundColor: "#ffffff", padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#333", lineHeight: 1.5 },
  header: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 10, flexDirection: "row", justifyContent: "space-between" },
  headerLeft: { flex: 1, flexDirection: "column" },
  photo: { width: 70, height: 90, borderRadius: 4, marginLeft: 15 },
  name: { fontSize: 24, fontWeight: "bold", color: "#000", lineHeight: 1.2, marginBottom: 4 },
  profession: { fontSize: 14, color: "#555", lineHeight: 1.2, marginBottom: 8 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, fontSize: 9, color: "#666", marginBottom: 2 },
  section: { marginTop: 12, marginBottom: 8 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 6, textTransform: "uppercase", color: "#000", borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 2 },
  item: { marginBottom: 8 },
  itemHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  itemTitle: { fontSize: 11, fontWeight: "bold", color: "#111" },
  itemDate: { fontSize: 10, color: "#666" },
  itemSubtitle: { fontSize: 10, fontStyle: "italic", color: "#444", marginBottom: 3 },
  itemDescription: { fontSize: 10, lineHeight: 1.4 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillItem: { fontSize: 10, color: "#333" },
  interestsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  interestItem: { fontSize: 10, color: "#333" },
  socialRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  socialItem: { fontSize: 9, color: "#0066cc", textDecoration: "none" }
});

// --- Interfaces ---
interface ResumeData {
  language?: "en" | "fr";
  profile: {
    firstName: string; middleName: string; lastName: string; gender: string; dob: string; maritalStatus: string;
    profession: string; streetAddress: string; city: string; state: string; nationality: string; passportNumber: string;
    phone: string; email: string; photoUrl: string;
  };
  socialLinks: { name: string; url: string }[];
  summary: string;
  experience: { jobTitle: string; employer: string; city: string; state: string; startDate: string; endDate: string; current: boolean; duties: string; }[];
  education: { schoolName: string; city: string; state: string; degree: string; fieldOfStudy: string; startDate: string; endDate: string; current: boolean; }[];
  skills: { name: string; level: string }[];
  interests: string[];
  customSections: { id: string; title: string; items: { title: string; subtitle: string; date: string; description: string }[]; }[];
}

const defaultData: ResumeData = {
  language: "en",
  profile: {
    firstName: "Jane", middleName: "", lastName: "Doe", gender: "", dob: "", maritalStatus: "",
    profession: "Senior Software Engineer", streetAddress: "123 Tech Lane", city: "San Francisco", state: "CA",
    nationality: "", passportNumber: "", phone: "(555) 123-4567", email: "jane.doe@example.com", photoUrl: ""
  },
  socialLinks: [{ name: "LinkedIn", url: "https://linkedin.com/in/janedoe" }],
  summary: "Experienced software engineer with over 8 years of experience in building scalable web applications and leading cross-functional teams. Passionate about clean code and modern web technologies.",
  experience: [
    { jobTitle: "Senior Developer", employer: "Tech Corp", city: "San Francisco", state: "CA", startDate: "Jan 2020", endDate: "", current: true, duties: "• Led a team of 5 engineers to build a new SaaS product.\n• Improved system performance by 40% through code optimization.\n• Mentored junior developers and conducted code reviews." }
  ],
  education: [
    { schoolName: "University of Technology", city: "San Jose", state: "CA", degree: "Bachelor of Science", fieldOfStudy: "Computer Science", startDate: "Sep 2014", endDate: "May 2018", current: false }
  ],
  skills: [
    { name: "JavaScript", level: "Expert" }, { name: "React", level: "Expert" }, { name: "Node.js", level: "Advanced" }
  ],
  interests: ["Open Source Contributing", "Hiking", "Photography"],
  customSections: []
};

const CUSTOM_SECTION_TYPES = {
  en: [
    "Referees", "Software", "Languages", "Certifications", "Awards", 
    "Publications", "Affiliations", "Accomplishments", "Additional Information", "Others"
  ],
  fr: [
    "Références", "Logiciels", "Langues", "Certifications", "Prix", 
    "Publications", "Affiliations", "Réalisations", "Informations Complémentaires", "Autres"
  ]
};

const translations = {
  en: {
    summary: "Professional Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    interests: "Interests",
    present: "Present",
    gender: "Gender",
    dob: "DOB",
    maritalStatus: "Marital Status",
    passport: "Passport",
    in: "in",
    yourName: "Your Name"
  },
  fr: {
    summary: "Résumé Professionnel",
    experience: "Expérience",
    education: "Éducation",
    skills: "Compétences",
    interests: "Centres d'intérêt",
    present: "Présent",
    gender: "Sexe",
    dob: "Date de naissance",
    maritalStatus: "État civil",
    passport: "Passeport",
    in: "en",
    yourName: "Votre Nom"
  }
};

// --- PDF Component ---
const ResumePDF = ({ data }: { data: ResumeData }) => {
  const { language = "en", profile, socialLinks, summary, experience, education, skills, interests, customSections } = data;
  const t = translations[language as "en" | "fr"] || translations.en;
  
  const translateValue = (val: string, lang: string) => {
    if (lang === "fr") {
      const map: Record<string, string> = {
        "Male": "Homme",
        "Female": "Femme",
        "Non-binary": "Non-binaire",
        "Prefer not to say": "Préfère ne pas le dire",
        "Single": "Célibataire",
        "Married": "Marié(e)",
        "Divorced": "Divorcé(e)",
        "Widowed": "Veuf/Veuve"
      };
      return map[val] || val;
    }
    return val;
  };

  const fullName = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ");
  const addressParts = [profile.streetAddress, profile.city, profile.state, profile.nationality].filter(Boolean).join(", ");
  const contactParts = [profile.phone, profile.email, addressParts].filter(Boolean);
  const personalInfoParts = [
    profile.gender && `${t.gender}: ${translateValue(profile.gender, language)}`,
    profile.dob && `${t.dob}: ${profile.dob}`,
    profile.maritalStatus && `${t.maritalStatus}: ${translateValue(profile.maritalStatus, language)}`,
    profile.passportNumber && `${t.passport}: ${profile.passportNumber}`
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{fullName || t.yourName}</Text>
            {profile.profession && <Text style={styles.profession}>{profile.profession}</Text>}
            
            {contactParts.length > 0 && (
              <View style={styles.contactRow}>
                {contactParts.map((part, i) => (
                  <Text key={i}>{part}{i < contactParts.length - 1 ? "  |  " : ""}</Text>
                ))}
              </View>
            )}
            
            {personalInfoParts.length > 0 && (
              <View style={[styles.contactRow, { marginTop: 4, color: "#888" }]}>
                {personalInfoParts.map((part, i) => (
                  <Text key={i}>{part}{i < personalInfoParts.length - 1 ? "  |  " : ""}</Text>
                ))}
              </View>
            )}

            {socialLinks && socialLinks.length > 0 && (
              <View style={styles.socialRow}>
                {(socialLinks || []).map((link, i) => (
                  <Link key={i} src={link.url} style={styles.socialItem}>{link.name}</Link>
                ))}
              </View>
            )}
          </View>
          {profile.photoUrl && (
            <Image src={profile.photoUrl} style={styles.photo} />
          )}
        </View>

        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.summary}</Text>
            <Text style={styles.itemDescription}>{summary}</Text>
          </View>
        )}

        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.experience}</Text>
            {(experience || []).map((exp, i) => (
              <View key={i} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                  <Text style={styles.itemDate}>{exp.startDate} - {exp.current ? t.present : exp.endDate}</Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {exp.employer}{exp.city || exp.state ? ` | ${[exp.city, exp.state].filter(Boolean).join(", ")}` : ""}
                </Text>
                {exp.duties && <Text style={styles.itemDescription}>{exp.duties}</Text>}
              </View>
            ))}
          </View>
        )}

        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.education}</Text>
            {(education || []).map((edu, i) => (
              <View key={i} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}{edu.fieldOfStudy ? ` ${t.in} ${edu.fieldOfStudy}` : ""}</Text>
                  <Text style={styles.itemDate}>{edu.startDate} - {edu.current ? t.present : edu.endDate}</Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {edu.schoolName}{edu.city || edu.state ? ` | ${[edu.city, edu.state].filter(Boolean).join(", ")}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.skills}</Text>
            <View style={styles.skillsRow}>
              {(skills || []).map((skill, i) => (
                <Text key={i} style={styles.skillItem}>• {skill.name}{skill.level ? ` (${skill.level})` : ""}</Text>
              ))}
            </View>
          </View>
        )}

        {interests && interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.interests}</Text>
            <View style={styles.interestsRow}>
              {(interests || []).map((interest, i) => (
                <Text key={i} style={styles.interestItem}>• {interest}</Text>
              ))}
            </View>
          </View>
        )}

        {customSections && customSections.length > 0 && (customSections || []).map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {(section.items || []).map((item, i) => (
              <View key={i} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.date && <Text style={styles.itemDate}>{item.date}</Text>}
                </View>
                {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
                {item.description && <Text style={styles.itemDescription}>{item.description}</Text>}
              </View>
            ))}
          </View>
        ))}

      </Page>
    </Document>
  );
};

const A4PreviewWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-white dark:bg-zinc-950 overflow-y-auto overflow-x-hidden flex-1">
      <div className="w-full min-h-full">
        {children}
      </div>
    </div>
  );
};

// --- Live DOM Preview Component ---
const LiveResumePreview = ({ data }: { data: ResumeData }) => {
  const { language = "en", profile, socialLinks, summary, experience, education, skills, interests, customSections } = data;
  const t = translations[language as "en" | "fr"] || translations.en;
  
  const translateValue = (val: string, lang: string) => {
    if (lang === "fr") {
      const map: Record<string, string> = {
        "Male": "Homme",
        "Female": "Femme",
        "Non-binary": "Non-binaire",
        "Prefer not to say": "Préfère ne pas le dire",
        "Single": "Célibataire",
        "Married": "Marié(e)",
        "Divorced": "Divorcé(e)",
        "Widowed": "Veuf/Veuve"
      };
      return map[val] || val;
    }
    return val;
  };

  const fullName = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ");
  const addressParts = [profile.streetAddress, profile.city, profile.state, profile.nationality].filter(Boolean).join(", ");
  const contactParts = [profile.phone, profile.email, addressParts].filter(Boolean);
  const personalInfoParts = [
    profile.gender && `${t.gender}: ${translateValue(profile.gender, language)}`,
    profile.dob && `${t.dob}: ${profile.dob}`,
    profile.maritalStatus && `${t.maritalStatus}: ${translateValue(profile.maritalStatus, language)}`,
    profile.passportNumber && `${t.passport}: ${profile.passportNumber}`
  ].filter(Boolean);

  return (
    <div className="w-full min-h-full text-[#333] text-[12px] leading-[1.6] font-sans bg-white">
      <div className="w-full min-h-full p-4 sm:p-6 md:p-12">
        <motion.div layout className="flex justify-between border-b border-[#ccc] pb-4 mb-5">
          <div className="flex-1 flex flex-col">
            <motion.h1 layout className="text-3xl font-bold text-black leading-tight mb-1">{fullName || t.yourName}</motion.h1>
            {profile.profession && <motion.h2 layout className="text-[16px] text-[#555] leading-tight mb-2">{profile.profession}</motion.h2>}
            
            {contactParts.length > 0 && (
              <motion.div layout className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#666] mb-1">
                {contactParts.map((part, i) => (
                  <span key={i} className="flex items-center">
                    {part}{i < contactParts.length - 1 && <span className="ml-3 font-bold text-[#ccc]">|</span>}
                  </span>
                ))}
              </motion.div>
            )}
            
            {personalInfoParts.length > 0 && (
              <motion.div layout className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#888] mt-1">
                {personalInfoParts.map((part, i) => (
                  <span key={i} className="flex items-center">
                    {part}{i < personalInfoParts.length - 1 && <span className="ml-3 font-bold text-[#ccc]">|</span>}
                  </span>
                ))}
              </motion.div>
            )}

            {socialLinks && socialLinks.length > 0 && (
              <motion.div layout className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                {(socialLinks || []).map((link, i) => (
                  <a key={i} href={link.url} className="text-[11px] text-[#0066cc] hover:underline" target="_blank" rel="noreferrer">{link.name}</a>
                ))}
              </motion.div>
            )}
          </div>
          {profile.photoUrl && (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-4 shrink-0">
              <img src={profile.photoUrl} className="w-[80px] h-[100px] rounded object-cover border border-zinc-200" alt="Profile" />
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {summary && (
            <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-5 mb-4">
              <h3 className="text-[14px] font-bold mb-2 uppercase text-black border-b border-[#eee] pb-1">{t.summary}</h3>
              <p className="whitespace-pre-wrap">{summary}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {experience && experience.length > 0 && (
            <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-5 mb-4">
              <h3 className="text-[14px] font-bold mb-2 uppercase text-black border-b border-[#eee] pb-1">{t.experience}</h3>
              <div className="flex flex-col gap-4">
                {(experience || []).map((exp, i) => (
                  <motion.div layout key={i}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[13px] font-bold text-[#111]">{exp.jobTitle}</span>
                      <span className="text-[12px] text-[#666]">{exp.startDate} - {exp.current ? t.present : exp.endDate}</span>
                    </div>
                    <div className="text-[12px] italic text-[#444] mb-1.5">
                      {exp.employer}{exp.city || exp.state ? ` | ${[exp.city, exp.state].filter(Boolean).join(", ")}` : ""}
                    </div>
                    {exp.duties && <div className="whitespace-pre-wrap">{exp.duties}</div>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {education && education.length > 0 && (
            <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-5 mb-4">
              <h3 className="text-[14px] font-bold mb-2 uppercase text-black border-b border-[#eee] pb-1">{t.education}</h3>
              <div className="flex flex-col gap-4">
                {(education || []).map((edu, i) => (
                  <motion.div layout key={i}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[13px] font-bold text-[#111]">{edu.degree}{edu.fieldOfStudy ? ` ${t.in} ${edu.fieldOfStudy}` : ""}</span>
                      <span className="text-[12px] text-[#666]">{edu.startDate} - {edu.current ? t.present : edu.endDate}</span>
                    </div>
                    <div className="text-[12px] italic text-[#444]">
                      {edu.schoolName}{edu.city || edu.state ? ` | ${[edu.city, edu.state].filter(Boolean).join(", ")}` : ""}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {skills && skills.length > 0 && (
            <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-5 mb-4">
              <h3 className="text-[14px] font-bold mb-2 uppercase text-black border-b border-[#eee] pb-1">{t.skills}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {(skills || []).map((skill, i) => (
                  <motion.span layout key={i} className="flex items-center text-[12px]">
                    <span className="mr-1 text-[#888]">•</span> {skill.name}{skill.level ? ` (${skill.level})` : ""}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {interests && interests.length > 0 && (
            <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-5 mb-4">
              <h3 className="text-[14px] font-bold mb-2 uppercase text-black border-b border-[#eee] pb-1">{t.interests}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {(interests || []).map((interest, i) => (
                  <motion.span layout key={i} className="flex items-center text-[12px]">
                    <span className="mr-1 text-[#888]">•</span> {interest}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {customSections && customSections.length > 0 && (customSections || []).map((section, idx) => (
            <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key={section.id} className="mt-5 mb-4">
              <h3 className="text-[14px] font-bold mb-2 uppercase text-black border-b border-[#eee] pb-1">{section.title}</h3>
              <div className="flex flex-col gap-4">
                {(section.items || []).map((item, i) => (
                  <motion.div layout key={i}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[13px] font-bold text-[#111]">{item.title}</span>
                      {item.date && <span className="text-[12px] text-[#666]">{item.date}</span>}
                    </div>
                    {item.subtitle && <div className="text-[12px] italic text-[#444] mb-1.5">{item.subtitle}</div>}
                    {item.description && <div className="whitespace-pre-wrap">{item.description}</div>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

      </div>
    </div>
  );
};

// --- Helper Components ---
function CollapsibleCard({ title, children, defaultOpen = false, action }: { title: string, children: React.ReactNode, defaultOpen?: boolean, action?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between cursor-pointer bg-zinc-50/50 dark:bg-zinc-900/50 py-4 transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50" onClick={() => setIsOpen(!isOpen)}>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
          {isOpen ? <ChevronUp className="h-5 w-5 text-zinc-500" /> : <ChevronDown className="h-5 w-5 text-zinc-500" />}
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <CardContent className="pt-4 pb-6 space-y-4">{children}</CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

const SectionNotice = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 flex items-start gap-3 rounded-lg bg-blue-50/80 p-3.5 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50 shadow-sm">
    <Lightbulb className="h-5 w-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
    <div className="leading-relaxed whitespace-pre-line">{children}</div>
  </div>
);

// --- Main Component ---
export function ResumeGenerator() {
  const [data, setData] = useState<ResumeData>(() => storage.get("resume_data_v2", defaultData));
  const debouncedData = useDebounce(data, 800);
  const [instance, updateInstance] = usePDF({ document: <ResumePDF data={debouncedData} /> });
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [showSectionMenu, setShowSectionMenu] = useState(false);

  useEffect(() => {
    storage.set("resume_data_v2", data);
  }, [data]);

  useEffect(() => {
    updateInstance(<ResumePDF data={debouncedData} />);
  }, [debouncedData, updateInstance]);

  const updateProfile = (field: keyof ResumeData["profile"], value: string) => {
    setData(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile("photoUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => setData(prev => ({ ...prev, experience: [...prev.experience, { jobTitle: "", employer: "", city: "", state: "", startDate: "", endDate: "", current: false, duties: "" }] }));
  const updateExperience = (index: number, field: keyof ResumeData["experience"][0], value: any) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setData(prev => ({ ...prev, experience: newExp }));
  };
  const removeExperience = (index: number) => setData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));

  const addEducation = () => setData(prev => ({ ...prev, education: [...prev.education, { schoolName: "", city: "", state: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", current: false }] }));
  const updateEducation = (index: number, field: keyof ResumeData["education"][0], value: any) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setData(prev => ({ ...prev, education: newEdu }));
  };
  const removeEducation = (index: number) => setData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));

  const addSkill = () => setData(prev => ({ ...prev, skills: [...prev.skills, { name: "", level: "" }] }));
  const updateSkill = (index: number, field: keyof ResumeData["skills"][0], value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setData(prev => ({ ...prev, skills: newSkills }));
  };
  const removeSkill = (index: number) => setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));

  const addInterest = () => setData(prev => ({ ...prev, interests: [...prev.interests, ""] }));
  const updateInterest = (index: number, value: string) => {
    const newInterests = [...data.interests];
    newInterests[index] = value;
    setData(prev => ({ ...prev, interests: newInterests }));
  };
  const removeInterest = (index: number) => setData(prev => ({ ...prev, interests: prev.interests.filter((_, i) => i !== index) }));

  const addSocialLink = () => setData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { name: "", url: "" }] }));
  const updateSocialLink = (index: number, field: keyof ResumeData["socialLinks"][0], value: string) => {
    const newLinks = [...data.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setData(prev => ({ ...prev, socialLinks: newLinks }));
  };
  const removeSocialLink = (index: number) => setData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) }));

  const getDefaultForSection = (title: string, lang: "en" | "fr") => {
    const isFr = lang === "fr";
    switch(title) {
      case "Referees":
      case "Références": 
        return { title: isFr ? "Nom de la référence" : "Reference Name", subtitle: isFr ? "Relation / Entreprise" : "Relationship / Company", date: "", description: isFr ? "Email: \nTéléphone: " : "Email: \nPhone: " };
      case "Software":
      case "Logiciels": 
        return { title: isFr ? "Nom du logiciel" : "Software Name", subtitle: isFr ? "Niveau de compétence" : "Proficiency Level", date: "", description: "" };
      case "Languages":
      case "Langues": 
        return { title: isFr ? "Langue" : "Language", subtitle: isFr ? "Niveau (ex: Courant, Maternel)" : "Proficiency (e.g., Fluent, Native)", date: "", description: "" };
      case "Certifications": 
        return { title: isFr ? "Nom de la certification" : "Certification Name", subtitle: isFr ? "Organisme de délivrance" : "Issuing Organization", date: isFr ? "Année" : "Year", description: "" };
      case "Awards":
      case "Prix": 
        return { title: isFr ? "Nom du prix" : "Award Name", subtitle: isFr ? "Émetteur" : "Issuer", date: isFr ? "Année" : "Year", description: "" };
      case "Publications": 
        return { title: isFr ? "Titre de la publication" : "Publication Title", subtitle: isFr ? "Journal / Éditeur" : "Journal / Publisher", date: isFr ? "Année" : "Year", description: isFr ? "Lien ou brève description" : "Link or brief description" };
      case "Affiliations": 
        return { title: isFr ? "Nom de l'organisation" : "Organization Name", subtitle: isFr ? "Rôle" : "Role", date: isFr ? "Année - Année" : "Year - Year", description: "" };
      case "Accomplishments":
      case "Réalisations": 
        return { title: isFr ? "Réalisation" : "Accomplishment", subtitle: "", date: "", description: isFr ? "Décrivez ce que vous avez accompli et l'impact." : "Describe what you achieved and the impact." };
      default: 
        return { title: isFr ? "Titre de l'élément" : "Item Title", subtitle: isFr ? "Sous-titre" : "Subtitle", date: isFr ? "Date" : "Date", description: isFr ? "Description" : "Description" };
    }
  };

  const addCustomSection = (title: string) => {
    setData(prev => ({ ...prev, customSections: [...prev.customSections, { id: Date.now().toString(), title, items: [getDefaultForSection(title, prev.language || "en")] }] }));
    setShowSectionMenu(false);
  };
  const removeCustomSection = (id: string) => setData(prev => ({ ...prev, customSections: prev.customSections.filter(s => s.id !== id) }));
  const addCustomSectionItem = (sectionId: string) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => s.id === sectionId ? { ...s, items: [...s.items, { title: "", subtitle: "", date: "", description: "" }] } : s)
    }));
  };
  const updateCustomSectionItem = (sectionId: string, itemIndex: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => s.id === sectionId ? {
        ...s,
        items: s.items.map((item, i) => i === itemIndex ? { ...item, [field]: value } : item)
      } : s)
    }));
  };
  const removeCustomSectionItem = (sectionId: string, itemIndex: number) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => s.id === sectionId ? {
        ...s,
        items: s.items.filter((_, i) => i !== itemIndex)
      } : s)
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col lg:flex-row">
      {/* Mobile Tabs */}
      <div className="flex p-4 lg:hidden border-b border-zinc-200/60 dark:border-zinc-800/60 sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <div className="flex w-full rounded-xl bg-zinc-200/50 p-1 dark:bg-zinc-800/50">
          <button onClick={() => setActiveTab("edit")} className={cn("flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all", activeTab === "edit" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400")}>
            <Edit3 className="h-4 w-4" /> Edit
          </button>
          <button onClick={() => setActiveTab("preview")} className={cn("flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all", activeTab === "preview" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400")}>
            <Eye className="h-4 w-4" /> Preview
          </button>
        </div>
      </div>

      {/* Edit Area */}
      <div className={cn("w-full overflow-y-auto border-r border-zinc-200/60 p-4 lg:p-6 lg:w-[55%] xl:w-1/2 dark:border-zinc-800/60", activeTab === "preview" ? "hidden lg:block" : "block")}>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ATS Resume Builder</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Create an ATS-friendly, professional resume.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <ProjectManager
              storageKey="resume_projects_v1"
              currentData={data}
              onLoad={(newData) => setData(newData)}
              titleExtractor={(d) => `${d.profile.firstName} ${d.profile.lastName}`}
              typeLabel="Resume"
            />
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
              <button 
                onClick={() => setData(prev => ({ ...prev, language: "en" }))}
              className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", data.language !== "fr" ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100")}
            >
              English
            </button>
            <button 
              onClick={() => setData(prev => ({ ...prev, language: "fr" }))}
              className={cn("px-3 py-1.5 text-sm font-medium rounded-md transition-all", data.language === "fr" ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100")}
            >
              Français
            </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 pb-20">
          
          {/* Profile Section */}
          <CollapsibleCard title="Profile" defaultOpen={true}>
            <SectionNotice>
              What's the best way for Employers to contact you?
              We suggest including an email and phone number.
            </SectionNotice>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col justify-end space-y-2"><Label>First Name</Label><Input value={data.profile.firstName} onChange={(e) => updateProfile("firstName", e.target.value)} /></div>
              <div className="flex flex-col justify-end space-y-2"><Label>Middle Name (Optional)</Label><Input value={data.profile.middleName} onChange={(e) => updateProfile("middleName", e.target.value)} /></div>
              <div className="flex flex-col justify-end space-y-2"><Label>Last Name</Label><Input value={data.profile.lastName} onChange={(e) => updateProfile("lastName", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col justify-end space-y-2"><Label>Profession</Label><Input value={data.profile.profession} onChange={(e) => updateProfile("profession", e.target.value)} /></div>
              <div className="flex flex-col justify-end space-y-2"><Label>Email</Label><Input type="email" value={data.profile.email} onChange={(e) => updateProfile("email", e.target.value)} /></div>
              <div className="flex flex-col justify-end space-y-2"><Label>Phone</Label><Input value={data.profile.phone} onChange={(e) => updateProfile("phone", e.target.value)} /></div>
              <div className="flex flex-col justify-end space-y-2"><Label>Street Address</Label><Input value={data.profile.streetAddress} onChange={(e) => updateProfile("streetAddress", e.target.value)} /></div>
              <div className="flex flex-col justify-end space-y-2"><Label>City</Label><Input value={data.profile.city} onChange={(e) => updateProfile("city", e.target.value)} /></div>
              <div className="flex flex-col justify-end space-y-2"><Label>State/Province</Label><Input value={data.profile.state} onChange={(e) => updateProfile("state", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col justify-end space-y-2">
                <Label>Gender (Optional)</Label>
                <select 
                  className="flex h-10 w-full rounded-xl border border-zinc-200/80 bg-white/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:focus-visible:ring-zinc-100/20"
                  value={data.profile.gender} 
                  onChange={(e) => updateProfile("gender", e.target.value)}
                >
                  <option value="">{data.language === "fr" ? "Sélectionner le sexe" : "Select Gender"}</option>
                  <option value="Male">{data.language === "fr" ? "Homme" : "Male"}</option>
                  <option value="Female">{data.language === "fr" ? "Femme" : "Female"}</option>
                  <option value="Non-binary">{data.language === "fr" ? "Non-binaire" : "Non-binary"}</option>
                  <option value="Prefer not to say">{data.language === "fr" ? "Préfère ne pas le dire" : "Prefer not to say"}</option>
                </select>
              </div>
              <div className="flex flex-col justify-end space-y-2"><Label>Date of Birth (Optional)</Label><Input type="date" value={data.profile.dob} onChange={(e) => updateProfile("dob", e.target.value)} /></div>
              <div className="flex flex-col justify-end space-y-2">
                <Label>Marital Status (Optional)</Label>
                <select 
                  className="flex h-10 w-full rounded-xl border border-zinc-200/80 bg-white/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:focus-visible:ring-zinc-100/20"
                  value={data.profile.maritalStatus} 
                  onChange={(e) => updateProfile("maritalStatus", e.target.value)}
                >
                  <option value="">{data.language === "fr" ? "Sélectionner l'état civil" : "Select Status"}</option>
                  <option value="Single">{data.language === "fr" ? "Célibataire" : "Single"}</option>
                  <option value="Married">{data.language === "fr" ? "Marié(e)" : "Married"}</option>
                  <option value="Divorced">{data.language === "fr" ? "Divorcé(e)" : "Divorced"}</option>
                  <option value="Widowed">{data.language === "fr" ? "Veuf/Veuve" : "Widowed"}</option>
                </select>
              </div>
              <div className="flex flex-col justify-end space-y-2"><Label>Nationality (Optional)</Label><Input value={data.profile.nationality} onChange={(e) => updateProfile("nationality", e.target.value)} /></div>
              <div className="flex flex-col justify-end space-y-2"><Label>Passport Number (Optional)</Label><Input value={data.profile.passportNumber} onChange={(e) => updateProfile("passportNumber", e.target.value)} /></div>
            </div>
          </CollapsibleCard>

          {/* Photo Section */}
          <CollapsibleCard title="Photo / Social Links (Optional)">
            <SectionNotice>
              Including a photo with your CV is not recommended when applying for jobs in the United Kingdom, the United States or Canada. Only use this template if you intend to apply for jobs outside these areas or have a specific need for a CV that includes a photo. Otherwise, please click the Download Resume button.
            </SectionNotice>
            <div className="space-y-4">
              <Label>Profile Photo</Label>
              <div className="flex items-center gap-4">
                {data.profile.photoUrl && (
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded border border-zinc-200 dark:border-zinc-800">
                    <img src={data.profile.photoUrl} alt="Profile" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <Input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoUpload} />
                  <p className="text-xs text-zinc-500">Upload a JPG or PNG image. This avoids "Failed to fetch" CORS errors by loading the image directly from your device.</p>
                  {data.profile.photoUrl && (
                    <Button variant="outline" size="sm" className="text-red-500 mt-2" onClick={() => updateProfile("photoUrl", "")}>
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleCard>

          {/* Summary Section */}
          <CollapsibleCard title="Professional Summary">
            <SectionNotice>
              Briefly describe the value that you bring through your skills, background and experience.
              Write a career overview so that hiring managers can immediately see the value that you bring.
            </SectionNotice>
            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea className="min-h-[100px]" placeholder="Showing examples for: Experienced software engineer..." value={data.summary} onChange={(e) => setData(prev => ({ ...prev, summary: e.target.value }))} />
            </div>
          </CollapsibleCard>

          {/* Experience Section */}
          <CollapsibleCard title="Experience" action={<Button variant="outline" size="sm" onClick={addExperience}><Plus className="h-4 w-4 mr-1"/> Add</Button>}>
            <SectionNotice>
              Now, let’s fill out your work history.
              Here’s what you need to know: Employers scan your resume for six seconds to decide if you’re a match.
              We’ll suggest bullet points that make a great impression.
            </SectionNotice>
            {data.experience.map((exp, i) => (
              <motion.div layout key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-900/50 relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" onClick={() => removeExperience(i)}><Trash2 className="h-3 w-3" /></Button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2"><Label>Job Title</Label><Input value={exp.jobTitle} onChange={(e) => updateExperience(i, "jobTitle", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Employer</Label><Input value={exp.employer} onChange={(e) => updateExperience(i, "employer", e.target.value)} /></div>
                  <div className="space-y-2"><Label>City</Label><Input value={exp.city} onChange={(e) => updateExperience(i, "city", e.target.value)} /></div>
                  <div className="space-y-2"><Label>State</Label><Input value={exp.state} onChange={(e) => updateExperience(i, "state", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Start Date</Label><Input placeholder="e.g. Jan 2020" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} /></div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <div className="flex gap-2 items-center">
                      <Input placeholder={data.language === "fr" ? "ex: Présent" : "e.g. Present"} disabled={exp.current} value={exp.current ? (data.language === "fr" ? "Présent" : "Present") : exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} />
                      <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                        <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(i, "current", e.target.checked)} className="rounded border-zinc-300" />
                        {data.language === "fr" ? "J'y travaille actuellement" : "I currently work here"}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Job Duties / Responsibilities</Label>
                  <Textarea className="min-h-[100px]" placeholder="Showing examples for: • Developed new features..." value={exp.duties} onChange={(e) => updateExperience(i, "duties", e.target.value)} />
                </div>
              </motion.div>
            ))}
          </CollapsibleCard>

          {/* Education Section */}
          <CollapsibleCard title="Education" action={<Button variant="outline" size="sm" onClick={addEducation}><Plus className="h-4 w-4 mr-1"/> Add</Button>}>
            <SectionNotice>
              Tell us about your education.
              Include every school, even if you're still there or didn't graduate.
            </SectionNotice>
            {data.education.map((edu, i) => (
              <motion.div layout key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-900/50 relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" onClick={() => removeEducation(i)}><Trash2 className="h-3 w-3" /></Button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2"><Label>School Name</Label><Input value={edu.schoolName} onChange={(e) => updateEducation(i, "schoolName", e.target.value)} /></div>
                  <div className="space-y-2"><Label>City</Label><Input value={edu.city} onChange={(e) => updateEducation(i, "city", e.target.value)} /></div>
                  <div className="space-y-2"><Label>State</Label><Input value={edu.state} onChange={(e) => updateEducation(i, "state", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Select a degree</Label><Input value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Field of Study</Label><Input value={edu.fieldOfStudy} onChange={(e) => updateEducation(i, "fieldOfStudy", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Graduation Start Date</Label><Input placeholder="e.g. Sep 2014" value={edu.startDate} onChange={(e) => updateEducation(i, "startDate", e.target.value)} /></div>
                  <div className="space-y-2">
                    <Label>Graduation End Date</Label>
                    <div className="flex gap-2 items-center">
                      <Input placeholder={data.language === "fr" ? "ex: Mai 2018" : "e.g. May 2018"} disabled={edu.current} value={edu.current ? (data.language === "fr" ? "Présent" : "Present") : edu.endDate} onChange={(e) => updateEducation(i, "endDate", e.target.value)} />
                      <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                        <input type="checkbox" checked={edu.current} onChange={(e) => updateEducation(i, "current", e.target.checked)} className="rounded border-zinc-300" />
                        {data.language === "fr" ? "J'étudie actuellement ici" : "I currently study here"}
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CollapsibleCard>

          {/* Skills Section */}
          <CollapsibleCard title="Skills" action={<Button variant="outline" size="sm" onClick={addSkill}><Plus className="h-4 w-4 mr-1"/> Add More Skills</Button>}>
            <SectionNotice>
              Next, let’s take care of your skills.
              Here’s what you need to know: Employers scan skills for relevant keywords.
              Enter 4-6 skills that are most relevant to your desired job.
            </SectionNotice>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="space-y-2 flex-1"><Label>Skill</Label><Input value={skill.name} onChange={(e) => updateSkill(i, "name", e.target.value)} /></div>
                  <div className="space-y-2 flex-1"><Label>Level (Optional)</Label><Input placeholder="e.g. Expert" value={skill.level} onChange={(e) => updateSkill(i, "level", e.target.value)} /></div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-red-500" onClick={() => removeSkill(i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </CollapsibleCard>

          {/* Interests Section */}
          <CollapsibleCard title="Interests" action={<Button variant="outline" size="sm" onClick={addInterest}><Plus className="h-4 w-4 mr-1"/> Add More Interests</Button>}>
            <SectionNotice>
              Hobbies / Interests.
              Showcase your Interests to an employer.
            </SectionNotice>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.interests.map((interest, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input value={interest} onChange={(e) => updateInterest(i, e.target.value)} placeholder="e.g. Reading" />
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-red-500 shrink-0" onClick={() => removeInterest(i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </CollapsibleCard>

          {/* Social Links Section */}
          <CollapsibleCard title="Social Links" action={<Button variant="outline" size="sm" onClick={addSocialLink}><Plus className="h-4 w-4 mr-1"/> Add Social Link</Button>}>
            <div className="space-y-4">
              {data.socialLinks.map((link, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="space-y-2 flex-1"><Label>Platform Name</Label><Input placeholder="e.g. LinkedIn" value={link.name} onChange={(e) => updateSocialLink(i, "name", e.target.value)} /></div>
                  <div className="space-y-2 flex-[2]"><Label>URL</Label><Input placeholder="https://" value={link.url} onChange={(e) => updateSocialLink(i, "url", e.target.value)} /></div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-red-500 shrink-0" onClick={() => removeSocialLink(i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </CollapsibleCard>

          {/* Custom Sections */}
          {data.customSections.map((section) => (
            <CollapsibleCard key={section.id} title={section.title} action={<Button variant="outline" size="sm" onClick={() => addCustomSectionItem(section.id)}><Plus className="h-4 w-4 mr-1"/> Add Item</Button>}>
              <div className="space-y-4">
                <Button variant="ghost" size="sm" className="text-red-500 w-full justify-start" onClick={() => removeCustomSection(section.id)}><Trash2 className="h-4 w-4 mr-2" /> Remove Entire Section</Button>
                {section.items.map((item, i) => (
                  <motion.div layout key={i} className="space-y-4 rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-900/50 relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" onClick={() => removeCustomSectionItem(section.id, i)}><Trash2 className="h-3 w-3" /></Button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2"><Label>Title</Label><Input value={item.title} onChange={(e) => updateCustomSectionItem(section.id, i, "title", e.target.value)} /></div>
                      <div className="space-y-2"><Label>Subtitle / Organization</Label><Input value={item.subtitle} onChange={(e) => updateCustomSectionItem(section.id, i, "subtitle", e.target.value)} /></div>
                      <div className="space-y-2"><Label>Date</Label><Input value={item.date} onChange={(e) => updateCustomSectionItem(section.id, i, "date", e.target.value)} /></div>
                    </div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={item.description} onChange={(e) => updateCustomSectionItem(section.id, i, "description", e.target.value)} /></div>
                  </motion.div>
                ))}
              </div>
            </CollapsibleCard>
          ))}

          {/* Add Section Button */}
          <div className="relative">
            <Button className="w-full border-dashed border-2 bg-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800" variant="outline" onClick={() => setShowSectionMenu(!showSectionMenu)}>
              <Plus className="mr-2 h-4 w-4" /> Add custom section
            </Button>
            <AnimatePresence>
              {showSectionMenu && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 p-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CUSTOM_SECTION_TYPES[data.language || "en"].map(type => (
                    <Button key={type} variant="ghost" size="sm" className="justify-start" onClick={() => addCustomSection(type)}>
                      {type}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Preview Area */}
      <div className={cn("h-full w-full bg-zinc-100 lg:w-[45%] xl:w-1/2 dark:bg-zinc-900 border-l border-zinc-200/60 dark:border-zinc-800/60 flex flex-col overflow-hidden", activeTab === "edit" ? "hidden lg:flex" : "flex")}>
        {/* Preview Action Header / Toolbar */}
        <div className="shrink-0 px-3 sm:px-4 py-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-zinc-200/70 dark:border-zinc-800/70 flex flex-wrap items-center justify-between gap-2 z-10 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{data.language === "fr" ? "Aperçu en direct" : "Live Preview"}</span>
          </div>
          <div>
            {instance.url ? (
              <a href={instance.url} download={`${data.profile.firstName || 'My'}_${data.profile.lastName || 'Resume'}.pdf`} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-95">
                <Download className="h-3.5 w-3.5" /> {data.language === "fr" ? "Télécharger PDF" : "Download PDF"}
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-500 shadow-xs cursor-not-allowed">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> {data.language === "fr" ? "Génération..." : "Generating PDF..."}
              </div>
            )}
          </div>
        </div>
        
        <A4PreviewWrapper>
          <LiveResumePreview data={data} />
        </A4PreviewWrapper>
      </div>
    </motion.div>
  );
}
