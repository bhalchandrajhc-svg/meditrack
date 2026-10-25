import { useState } from "react";
import {
    Sparkles,
    TrendingUp,
    TrendingDown,
    Lightbulb,
    AlertTriangle,
    RefreshCw,
    CheckCircle,
    ShoppingBag
} from "lucide-react";
import "./AiReportModule.css";

function AiReportModule({ aiData, loading, onRefresh }) {

    const [activeTab, setActiveTab] = useState("all");

    if (loading) {
        return (
            <div className="ai-report-card ai-loading-state">
                <div className="ai-spinner">
                    <Sparkles className="spin-icon" size={32} />
                </div>
                <h3>Analyzing Shop Sales & Profit Data...</h3>
                <p>Generating AI recommendations for high selling medicines, slow items, and inventory suggestions.</p>
            </div>
        );
    }

    const { summary, highSelling, lowSelling, reorderAlerts, recommendedProducts } = aiData || {};

    return (
        <div className="ai-report-card">
            {/* Header */}
            <div className="ai-card-header">
                <div className="ai-title-wrap">
                    <div className="ai-icon-badge">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3>AI Store Analytics & Profit Engine</h3>
                        <p>Smart sales insights, slow-moving alerts & high-profit inventory recommendations for your shop.</p>
                    </div>
                </div>

                <button className="ai-refresh-btn" onClick={onRefresh}>
                    <RefreshCw size={15} />
                    <span>Refresh AI Insights</span>
                </button>
            </div>

            {/* Quick Metrics Summary Grid */}
            <div className="ai-summary-grid">
                <div className="ai-metric-card">
                    <span className="metric-title">Estimated Revenue Boost</span>
                    <h2 className="metric-value text-blue">{summary?.profitGrowthPotential || "+22% Growth"}</h2>
                </div>

                <div className="ai-metric-card">
                    <span className="metric-title">Store Performance Score</span>
                    <h2 className="metric-value text-green">{summary?.healthScore || "95/100"}</h2>
                </div>

                <div className="ai-metric-card">
                    <span className="metric-title">Top Selling Units</span>
                    <h2 className="metric-value">{summary?.totalTopSold || 0} Units</h2>
                </div>

                <div className="ai-metric-card">
                    <span className="metric-title">Re-stock Alerts</span>
                    <h2 className="metric-value text-orange">{reorderAlerts?.length || 0} Items Low</h2>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="ai-tabs-nav">
                <button
                    className={`ai-tab-pill ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                >
                    Overview & All Insights
                </button>

                <button
                    className={`ai-tab-pill ${activeTab === "high" ? "active" : ""}`}
                    onClick={() => setActiveTab("high")}
                >
                    🔥 High Selling (जास्त विक्री)
                </button>

                <button
                    className={`ai-tab-pill ${activeTab === "low" ? "active" : ""}`}
                    onClick={() => setActiveTab("low")}
                >
                    📉 Low Selling (कमी विक्री)
                </button>

                <button
                    className={`ai-tab-pill ${activeTab === "recommend" ? "active" : ""}`}
                    onClick={() => setActiveTab("recommend")}
                >
                    💡 AI Profit Recommendations (नफा सूचना)
                </button>
            </div>

            {/* Tab Contents */}
            <div className="ai-tab-content">
                {/* 1. HIGH SELLING PRODUCTS */}
                {(activeTab === "all" || activeTab === "high") && (
                    <div className="ai-content-section">
                        <div className="section-header">
                            <div className="header-left">
                                <TrendingUp size={18} className="text-green" />
                                <h4>Top High Selling Products (जास्त Sell होणाऱ्या औषधी & Products)</h4>
                            </div>
                            <span className="status-badge high-badge">{highSelling?.length || 0} Products</span>
                        </div>

                        {highSelling && highSelling.length > 0 ? (
                            <div className="ai-items-grid">
                                {highSelling.map((item, idx) => (
                                    <div className="ai-product-card" key={idx}>
                                        <div className="product-card-top">
                                            <span className="rank-badge">#{idx + 1}</span>
                                            <span className="demand-pill">{item.demandLevel}</span>
                                        </div>

                                        <h5 className="product-name">{item.name}</h5>
                                        <span className="product-cat">{item.category}</span>

                                        <div className="product-details-list">
                                            <div className="detail-row">
                                                <span>Units Sold:</span>
                                                <strong>{item.totalSold} Units</strong>
                                            </div>
                                            <div className="detail-row">
                                                <span>Total Revenue:</span>
                                                <strong className="text-green">₹ {Number(item.totalRevenue || 0).toLocaleString()}</strong>
                                            </div>
                                            <div className="detail-row">
                                                <span>Stock Left:</span>
                                                <span className={item.stock <= 10 ? "text-orange fw-bold" : ""}>
                                                    {item.stock} Units
                                                </span>
                                            </div>
                                        </div>

                                        <div className="ai-suggestion-box">
                                            <Sparkles size={13} className="text-blue" />
                                            <span><strong>AI Tip:</strong> Fast moving item! Keep at least 25+ stock units to prevent stockouts.</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="ai-empty-box">No sales data available yet for top selling analysis.</div>
                        )}
                    </div>
                )}

                {/* 2. LOW SELLING PRODUCTS */}
                {(activeTab === "all" || activeTab === "low") && (
                    <div className="ai-content-section mt-4">
                        <div className="section-header">
                            <div className="header-left">
                                <TrendingDown size={18} className="text-orange" />
                                <h4>Low Selling / Slow Moving Products (कमी Sell होणाऱ्या औषधी)</h4>
                            </div>
                            <span className="status-badge low-badge">{lowSelling?.length || 0} Products</span>
                        </div>

                        {lowSelling && lowSelling.length > 0 ? (
                            <div className="ai-items-grid">
                                {lowSelling.map((item, idx) => (
                                    <div className="ai-product-card slow-product-card" key={idx}>
                                        <div className="product-card-top">
                                            <span className="slow-pill">{item.status}</span>
                                            <span className="stock-info">{item.stock} in Stock</span>
                                        </div>

                                        <h5 className="product-name">{item.name}</h5>
                                        <span className="product-cat">{item.category}</span>

                                        <div className="product-details-list">
                                            <div className="detail-row">
                                                <span>Total Sold:</span>
                                                <strong>{item.totalSold} Units</strong>
                                            </div>
                                            <div className="detail-row">
                                                <span>Price per Unit:</span>
                                                <span>₹ {item.price}</span>
                                            </div>
                                        </div>

                                        <div className="ai-suggestion-box slow-suggestion">
                                            <AlertTriangle size={13} className="text-orange" />
                                            <span><strong>AI Action:</strong> {item.recommendation}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="ai-empty-box">Excellent! All items in your shop inventory are moving steadily.</div>
                        )}
                    </div>
                )}

                {/* 3. AI PROFIT RECOMMENDATIONS */}
                {(activeTab === "all" || activeTab === "recommend") && (
                    <div className="ai-content-section mt-4">
                        <div className="section-header">
                            <div className="header-left">
                                <Lightbulb size={18} className="text-blue" />
                                <h4>AI Stock & Profit Recommendations (नफा आणि विक्री वाढवण्यासाठी काय ठेवावे)</h4>
                            </div>
                        </div>

                        <div className="recom-wrapper">
                            <div className="recom-intro">
                                <ShoppingBag size={20} className="text-blue" />
                                <div>
                                    <h5>High-Profit Product Additions Suggested by AI</h5>
                                    <p>Stocking these high-demand & essential pharmacy items will increase overall shop sales & net profit margin.</p>
                                </div>
                            </div>

                            <div className="recom-grid">
                                {recommendedProducts?.map((rec, idx) => (
                                    <div className="recom-item-row" key={idx}>
                                        <div className="recom-left">
                                            <span className="recom-index">{idx + 1}</span>
                                            <div>
                                                <h6 className="recom-name">{rec.name}</h6>
                                                <span className="recom-category">{rec.category}</span>
                                            </div>
                                        </div>

                                        <div className="recom-middle">
                                            <p className="recom-desc">
                                                <CheckCircle size={13} className="text-blue me-1" />
                                                <strong>Why Stock:</strong> {rec.reason}
                                            </p>
                                        </div>

                                        <div className="recom-right">
                                            <span className="profit-badge">Est. Profit: <strong>{rec.estimatedProfitMargin}</strong></span>
                                            <span className="demand-score">Demand: <strong>{rec.demandScore}</strong></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AiReportModule;
