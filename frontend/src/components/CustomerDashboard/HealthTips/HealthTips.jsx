import { useState } from "react";
import { BookOpen, Sparkles, Clock, User, X, ChevronRight, HeartPulse, ShieldAlert, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./HealthTips.css";

const BLOG_ARTICLES = [
    {
        id: "first-aid",
        category: "Emergency Tips",
        badgeColor: "rose",
        title: "Critical First Aid Guide: What to Do in Emergency Situations",
        snippet: "Step-by-step guidance for handling sudden high fever, minor burns, choking, and emergency CPR basics before medical help arrives.",
        readTime: "3 min read",
        author: "Dr. A. Sharma (MD)",
        date: "Updated Today",
        content: {
            intro: "Medical emergencies require calm and immediate action. Knowing basic first aid can save lives while waiting for ambulance or professional medical help.",
            sections: [
                {
                    heading: "1. High Fever & Heatstroke",
                    points: [
                        "Keep the person in a cool, ventilated area.",
                        "Apply cold compress or moist cloth on forehead and wrists.",
                        "Administer paracetamol only as recommended by doctor.",
                        "Provide adequate fluids to prevent dehydration."
                    ]
                },
                {
                    heading: "2. Choking First Aid (Heimlich Maneuver)",
                    points: [
                        "Stand behind the person and lean them slightly forward.",
                        "Perform 5 sharp back blows between shoulder blades.",
                        "Give up to 5 quick abdominal thrusts until object clears.",
                        "Call emergency service (108) immediately if breathing doesn't resume."
                    ]
                },
                {
                    heading: "3. Minor Burns Treatment",
                    points: [
                        "Cool burn immediately under cool running tap water for 10-15 mins.",
                        "Do NOT apply ice, butter, or toothpaste directly to burns.",
                        "Cover loosely with sterile non-stick bandage."
                    ]
                }
            ],
            dosAndDonts: {
                dos: ["Keep emergency contacts saved", "Stay calm and check pulse/breathing", "Loosen tight clothing"],
                donts: ["Do not give oral fluids to an unconscious person", "Do not burst blisters", "Do not delay calling 108"]
            }
        }
    },
    {
        id: "med-storage",
        category: "Medication Care",
        badgeColor: "blue",
        title: "How to Safely Store & Organize Your Daily Medications",
        snippet: "Avoid heat, humidity, and direct sunlight. Proper storage guidelines for insulin, syrups, eye drops, and daily pills.",
        readTime: "4 min read",
        author: "Pharm. S. Kulkarni",
        date: "Updated Yesterday",
        content: {
            intro: "Storing medicines incorrectly can reduce their potency or render them harmful. Follow these pharmacist-approved rules to keep your home medicine box safe.",
            sections: [
                {
                    heading: "1. Ideal Temperature Controls",
                    points: [
                        "Store regular tablets and capsules in a cool, dry place below 25°C.",
                        "Insulin, unopened eye drops, and certain vaccines require 2°C - 8°C refrigeration.",
                        "Never freeze liquid medicines or insulin vials."
                    ]
                },
                {
                    heading: "2. Moisture & Sunlight Protection",
                    points: [
                        "Avoid bathroom medicine cabinets due to high steam & humidity.",
                        "Keep original light-resistant amber bottles or blister packaging intact.",
                        "Keep out of reach of children and pets at all times."
                    ]
                },
                {
                    heading: "3. Expiry Date & Disposal Check",
                    points: [
                        "Inspect expiry dates monthly.",
                        "Dispose of expired or color-changed syrup safely.",
                        "Do not flush medications down sink or toilet."
                    ]
                }
            ],
            dosAndDonts: {
                dos: ["Keep liquid syrups sealed tightly", "Label opened eye drops with opening date", "Use pill organizers for daily doses"],
                donts: ["Do not store in hot cars or window sills", "Do not mix different pills in one bottle", "Do not use expired medicines"]
            }
        }
    },
    {
        id: "immunity-habits",
        category: "Daily Wellness",
        badgeColor: "emerald",
        title: "5 Essential Habits to Boost Immunity & Energy Everyday",
        snippet: "Simple daily routines including hydration, balanced nutrition, sleep cycles, and preventive health screenings.",
        readTime: "3 min read",
        author: "MediTrack Wellness Team",
        date: "Health Weekly",
        content: {
            intro: "A strong immune system is your best defense against seasonal flu, infections, and fatigue. Incorporate these scientifically backed habits into your lifestyle.",
            sections: [
                {
                    heading: "1. Consistent Hydration",
                    points: [
                        "Drink 2.5 to 3 liters of water daily.",
                        "Hydration supports cellular health and flush toxins."
                    ]
                },
                {
                    heading: "2. Balanced Micronutrient Intake",
                    points: [
                        "Include Vitamin C rich citrus fruits (amla, oranges, lemons).",
                        "Ensure adequate Vitamin D levels through sunlight or doctor-guided supplements.",
                        "Incorporate zinc & antioxidants from nuts and leafy greens."
                    ]
                },
                {
                    heading: "3. Sleep & Stress Management",
                    points: [
                        "Aim for 7-8 hours of restful sleep every night.",
                        "Practice 10 minutes of deep breathing or light exercise daily."
                    ]
                }
            ],
            dosAndDonts: {
                dos: ["Wash hands before meals", "Schedule annual health checkups", "Maintain active physical movement"],
                donts: ["Avoid self-medicating with antibiotics", "Minimize processed sugar intake", "Don't ignore persistent symptoms"]
            }
        }
    },
    {
        id: "otc-rules",
        category: "Medication Care",
        badgeColor: "purple",
        title: "Understanding Over-The-Counter vs. Prescription Medicines",
        snippet: "When is it safe to take OTC medicine, and why prescription upload is required for Schedule H drugs.",
        readTime: "5 min read",
        author: "Pharm. R. Deshmukh",
        date: "Safety Alert",
        content: {
            intro: "Knowing the difference between OTC products and prescription-only drugs helps prevent adverse drug interactions and antibiotic resistance.",
            sections: [
                {
                    heading: "1. Over-The-Counter (OTC) Products",
                    points: [
                        "Includes basic pain relievers, antacids, band-aids, and ORS.",
                        "Safe for short-term minor symptoms without prescription.",
                        "Always read package dosage instructions carefully."
                    ]
                },
                {
                    heading: "2. Prescription Required (Schedule H & H1)",
                    points: [
                        "Antibiotics, blood pressure meds, diabetes drugs, and sedatives.",
                        "Require valid prescription from a registered doctor.",
                        "Must complete full antibiotic course as prescribed."
                    ]
                }
            ],
            dosAndDonts: {
                dos: ["Upload clear doctor prescription when reserving Schedule H drugs", "Inform pharmacist of any known drug allergies", "Ask pharmacist about proper timing (before/after meals)"],
                donts: ["Never share prescription medicine with family members", "Never stop antibiotic course midway", "Avoid mixing alcohol with medicines"]
            }
        }
    }
];

function HealthTips() {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [activeArticle, setActiveArticle] = useState(null);

    const categories = [
        { key: "all", label: t("all", "All") },
        { key: "emergencyTips", label: t("emergencyTips", "Emergency Tips") },
        { key: "medicationCare", label: t("medicationCare", "Medication Care") },
        { key: "dailyWellness", label: t("dailyWellness", "Daily Wellness") }
    ];

    const translateCategory = (category) => {
        const map = {
            "Emergency Tips": t("emergencyTips", "Emergency Tips"),
            "Medication Care": t("medicationCare", "Medication Care"),
            "Daily Wellness": t("dailyWellness", "Daily Wellness")
        };
        return map[category] || category;
    };

    const translateReadTime = (readTime) => {
        const match = String(readTime || "").match(/(\d+)/);
        return match
            ? t("minRead", { count: Number(match[1]) })
            : readTime;
    };

    const translateDate = (date) => {
        const map = {
            "Updated Today": t("updatedToday", "Updated Today"),
            "Updated Yesterday": t("updatedYesterday", "Updated Yesterday"),
            "Health Weekly": t("healthWeekly", "Health Weekly"),
            "Safety Alert": t("safetyAlert", "Safety Alert")
        };
        return map[date] || date;
    };

    const filteredArticles = selectedCategory === "All"
        ? BLOG_ARTICLES
        : BLOG_ARTICLES.filter(a => a.category === selectedCategory);

    return (
        <section className="health-tips-section">
            <div className="health-tips-header">
                <div>
                    <span className="health-tips-badge">
                        <Sparkles size={14} /> {t("healthKnowledge", "Health Knowledge & Blog")}
                    </span>
                    <h2>{t("healthTips", "Health Tips & Medical Blog Guides")}</h2>
                    <p>{t("healthTipsDesc", "Expert articles and emergency advice for safer daily healthcare management")}</p>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className="health-category-filters">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        type="button"
                        className={`filter-pill ${selectedCategory === (cat.key === "all" ? "All" : BLOG_ARTICLES.find(a => a.category)?.category && cat.key === "emergencyTips" ? "Emergency Tips" : cat.key === "medicationCare" ? "Medication Care" : cat.key === "dailyWellness" ? "Daily Wellness" : "All") ? "active" : ""}`}
                        onClick={() => setSelectedCategory(
                            cat.key === "all" ? "All" :
                            cat.key === "emergencyTips" ? "Emergency Tips" :
                            cat.key === "medicationCare" ? "Medication Care" :
                            "Daily Wellness"
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            <div className="articles-grid">
                {filteredArticles.map((art) => (
                    <div key={art.id} className="article-card">
                        <div className="article-card-header">
                            <span className={`article-category-badge badge-${art.badgeColor}`}>
                                {translateCategory(art.category)}
                            </span>
                            <span className="read-time">
                                <Clock size={13} /> {translateReadTime(art.readTime)}
                            </span>
                        </div>
                        <h3>{art.title}</h3>
                        <p>{art.snippet}</p>
                        
                        <div className="article-footer">
                            <div className="author-info">
                                <User size={14} />
                                <span>{art.author}</span>
                            </div>
                            <button
                                type="button"
                                className="read-more-btn"
                                onClick={() => setActiveArticle(art)}
                            >
                                {t("readGuide", "Read Guide")} <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Article Modal Reader */}
            {activeArticle && (
                <div className="article-modal-overlay" onClick={() => setActiveArticle(null)}>
                    <div className="article-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className={`article-category-badge badge-${activeArticle.badgeColor}`}>
                                {translateCategory(activeArticle.category)}
                            </span>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setActiveArticle(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <h2>{activeArticle.title}</h2>
                            <div className="modal-meta">
                                <span><User size={14} /> {activeArticle.author}</span>
                                <span>•</span>
                                <span><Clock size={14} /> {translateReadTime(activeArticle.readTime)}</span>
                                <span>•</span>
                                <span>{translateDate(activeArticle.date)}</span>
                            </div>

                            <p className="modal-intro">{activeArticle.content.intro}</p>

                            <div className="modal-sections">
                                {activeArticle.content.sections.map((sec, idx) => (
                                    <div key={idx} className="modal-section-block">
                                        <h4>{sec.heading}</h4>
                                        <ul>
                                            {sec.points.map((pt, pIdx) => (
                                                <li key={pIdx}>{pt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {activeArticle.content.dosAndDonts && (
                                <div className="dos-donts-grid">
                                    <div className="dos-box">
                                        <h5><CheckCircle size={16} /> {t("keyDos", "Key Do's")}</h5>
                                        <ul>
                                            {activeArticle.content.dosAndDonts.dos.map((d, dIdx) => (
                                                <li key={dIdx}>{d}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="donts-box">
                                        <h5><ShieldAlert size={16} /> {t("keyDonts", "Key Don'ts")}</h5>
                                        <ul>
                                            {activeArticle.content.dosAndDonts.donts.map((d, dIdx) => (
                                                <li key={dIdx}>{d}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary text-slate-700"
                                onClick={() => setActiveArticle(null)}
                            >
                                {t("closeGuide", "Close Guide")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default HealthTips;