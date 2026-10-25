import {
    Grid,
    Pill,
    FlaskConical,
    Syringe,
    Sparkles,
    Droplet
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./CategoryFilter.css";

function CategoryFilter({ category = "All", setCategory }) {
    const { t } = useTranslation();

    const categories = [
        { key: "categoryAll", name: "All", icon: Grid },
        { key: "categoryTablet", name: "Tablet", icon: Pill },
        { key: "categoryCapsule", name: "Capsule", icon: Pill },
        { key: "categorySyrup", name: "Syrup", icon: FlaskConical },
        { key: "categoryInjection", name: "Injection", icon: Syringe },
        { key: "categoryOintment", name: "Ointment", icon: Sparkles },
        { key: "categoryDrops", name: "Drops", icon: Droplet },
        { key: "categoryCream", name: "Cream", icon: Sparkles }
    ];

    return (
        <div className="category-filter-container">
            <div className="category-filter-scroll">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = category.toLowerCase() === cat.name.toLowerCase();

                    return (
                        <button
                            key={cat.name}
                            className={`category-pill ${isActive ? "active" : ""}`}
                            onClick={() => setCategory && setCategory(cat.name)}
                        >
                            <Icon size={16} className="category-icon" />
                            <span>{t(cat.key, cat.name)}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default CategoryFilter;