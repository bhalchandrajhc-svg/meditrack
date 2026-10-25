import { useTranslation } from "react-i18next";
import "./ReportFilter.css";

function ReportFilter({

    search,
    setSearch,

    status,
    setStatus

}) {

    const { t } = useTranslation();

    return (

        <div className="report-filter">

            <input

                type="text"

                placeholder={t("Search Customer / Medicine") || "Search Customer / Medicine..."}

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

            />

            <select

                value={status}

                onChange={(e)=>setStatus(e.target.value)}

            >

                <option value="All Status">{t("All Status")}</option>

                <option value="Completed">{t("completed")}</option>

                <option value="Pending">{t("pending")}</option>

                <option value="Cancelled">{t("cancelled")}</option>

            </select>

        </div>

    );

}

export default ReportFilter;