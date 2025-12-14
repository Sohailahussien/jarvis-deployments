# Ready-to-Use Demo Prompts

## Overview

This document contains copy-paste ready prompts for demonstrating facilis.ai capabilities to water utility prospects. Each prompt is designed to showcase specific AI features and deliver impressive, actionable insights.

**Instructions**:
1. Upload the relevant CSV file(s) from the data/ folder first
2. Copy the entire prompt
3. Paste into facilis.ai
4. Let the AI work while explaining what it's doing
5. Review results with prospect

---

## Category 1: Water Quality Analysis

### Prompt 1A: Comprehensive Water Quality Assessment

```
I have uploaded water-quality-monitoring.csv containing water quality sensor data from our distribution network.

Please perform a comprehensive water quality analysis:

1. Summary statistics for all quality parameters (chlorine, pH, turbidity, temperature, conductivity)

2. Identify any regulatory exceedances:
   - Chlorine: 0.2-4.0 mg/L acceptable
   - pH: 6.5-8.5 acceptable
   - Turbidity: <5 NTU acceptable

3. Temporal analysis:
   - Quality trends over time
   - Time-of-day patterns
   - Day-of-week variations

4. Location-based analysis:
   - Which monitoring stations have the most issues?
   - Geographic patterns in quality problems

5. Correlation analysis:
   - How do parameters relate to each other?
   - What conditions lead to quality exceedances?

6. Predictive insights:
   - Which stations are at risk of future exceedances?
   - Early warning indicators

7. Actionable recommendations:
   - Priority areas for investigation
   - Suggested improvements to treatment or distribution

Please present findings with data visualizations and prioritized action items.
```

**What This Demonstrates**:
- Multi-parameter data analysis
- Regulatory compliance monitoring
- Pattern recognition
- Predictive capabilities
- Actionable recommendations

**Expected Results**:
- Exceedance identification (10-15 incidents)
- Clear station performance rankings
- Time-based patterns (morning/evening variations)
- 3-5 high-priority action items

---

### Prompt 1B: Water Quality Incident Investigation

```
Using water-quality-monitoring.csv, I need to investigate a turbidity spike that occurred on August 15, 2024.

Please analyze:

1. Timeline of the incident:
   - When did turbidity first exceed 5 NTU?
   - How long did it last?
   - Which stations were affected?

2. Contributing factors:
   - What were the conditions before/during/after?
   - Did other parameters (pH, chlorine, pressure) change?
   - Weather correlation (was there rainfall)?

3. Impact assessment:
   - How many customers potentially affected?
   - Water safety risk level

4. Root cause analysis:
   - Most likely cause based on data patterns
   - Similar historical incidents

5. Prevention recommendations:
   - Early warning indicators we should have caught
   - Monitoring improvements
   - Operational changes

Create an incident report suitable for management and regulators.
```

**What This Demonstrates**:
- Root cause analysis
- Multi-variable correlation
- Incident reporting capability
- Preventive recommendations

---

## Category 2: Distribution Network Optimization

### Prompt 2A: Non-Revenue Water Analysis

```
I have uploaded distribution-network-performance.csv with flow, pressure, and consumption data from our distribution network.

Perform a comprehensive Non-Revenue Water (NRW) analysis:

1. Calculate NRW metrics:
   - Total water produced vs. billed consumption
   - NRW percentage and volume
   - Financial loss (assume $1.50 per 1000 gallons)

2. Zone-level analysis:
   - Which pressure zones have highest losses?
   - Ranking by NRW percentage
   - Volume vs. percentage trade-offs

3. Leak detection indicators:
   - Pressure anomalies suggesting leaks
   - Abnormal flow patterns (minimum night flow analysis)
   - Flow/pressure correlation issues

4. Temporal patterns:
   - When do losses spike? (time of day, day of week)
   - Seasonal variations
   - Trending (improving or worsening?)

5. Prioritized action plan:
   - Top 10 zones for immediate investigation
   - Estimated water recovery potential
   - ROI analysis for repairs

6. Monitoring recommendations:
   - Additional sensors needed
   - Alert thresholds to configure

Present findings with maps, charts, and an executive summary showing potential savings.
```

**What This Demonstrates**:
- Financial impact quantification
- Prioritization algorithms
- Leak detection analytics
- ROI calculation
- Executive reporting

**Expected Results**:
- Identification of 25-30% NRW across network
- 8-10 high-priority zones
- $5-8M annual recovery potential
- Clear action plan

---

### Prompt 2B: Pressure Optimization Analysis

```
Using distribution-network-performance.csv, analyze our network pressure management to identify optimization opportunities.

1. Pressure profile analysis:
   - Current pressure ranges by zone
   - Comparison to optimal ranges (40-80 PSI)
   - Over-pressure and under-pressure incidents

2. Energy waste from over-pressure:
   - Which zones run at excessive pressure?
   - Energy cost of over-pumping (assume $0.12/kWh)
   - Potential savings from pressure reduction

3. Leak relationship:
   - Correlation between pressure and water loss
   - Estimated leak reduction from pressure optimization

4. Customer impact assessment:
   - Any zones with service pressure issues?
   - Impact of proposed pressure changes

5. Pressure Reducing Valve (PRV) recommendations:
   - Optimal locations for new PRVs
   - Settings for existing PRVs
   - Expected water and energy savings

6. Implementation roadmap:
   - Quick wins (immediate adjustments)
   - Medium-term investments (PRV installations)
   - Expected ROI and payback period

Provide a business case with financial justification for pressure optimization program.
```

**What This Demonstrates**:
- Multi-objective optimization (energy, water loss, service quality)
- Engineering recommendations
- Business case development
- Implementation planning

---

## Category 3: Energy Consumption Optimization

### Prompt 3A: Comprehensive Energy Analysis

```
I have uploaded energy-usage.csv containing energy consumption data from our water treatment and pumping facilities.

Perform a detailed energy optimization analysis:

1. Energy consumption patterns:
   - Total consumption and costs
   - Breakdown by facility type (treatment, pumping, admin)
   - Temporal patterns (hourly, daily, seasonal)

2. Efficiency benchmarking:
   - Energy per gallon produced/distributed
   - Comparison to industry standards
   - Facility performance ranking

3. Peak demand analysis:
   - When do we hit peak demand?
   - Peak demand charges (assume $15/kW)
   - Load factor calculation

4. Optimization opportunities:
   - Load shifting potential (off-peak production)
   - Equipment efficiency issues
   - Facilities running outside optimal parameters

5. Cost reduction scenarios:
   - Impact of 10% efficiency improvement
   - Savings from peak demand reduction
   - Benefits of time-of-use optimization

6. Renewable energy potential:
   - Facilities suitable for solar installation
   - Estimated solar generation vs. consumption
   - Payback analysis

7. Action plan:
   - Immediate operational adjustments (no cost)
   - Equipment upgrades (ROI analysis)
   - Long-term strategy (renewables, storage)

Present comprehensive energy strategy with 3-year financial projections.
```

**What This Demonstrates**:
- Complex energy analytics
- Benchmarking capabilities
- Scenario modeling
- Multi-year financial planning
- Renewable energy integration

**Expected Results**:
- Identification of 15-25% savings potential
- $2-4M annual savings opportunity
- Prioritized 20+ optimization actions
- 5-year strategic roadmap

---

### Prompt 3B: Peak Demand Reduction Strategy

```
Using energy-usage.csv, develop a strategy to reduce our peak demand charges, which represent 30% of our energy bill.

Analyze:

1. Peak demand profile:
   - When do peaks occur? (time of day, season)
   - Which facilities drive peak demand?
   - Duration and magnitude of peaks

2. Load shifting opportunities:
   - Which operations can be rescheduled?
   - Available storage capacity for time-shifting
   - Production vs. demand flexibility

3. Peak shaving scenarios:
   - Impact of shifting 20% of peak load
   - Optimal production schedules
   - Required operational changes

4. Financial impact:
   - Current peak demand charges
   - Savings from proposed optimizations
   - Implementation costs vs. benefits

5. Implementation plan:
   - Phase 1: Operational changes (immediate)
   - Phase 2: Automation and controls
   - Phase 3: Storage/battery additions

6. Monitoring and verification:
   - KPIs to track success
   - Automated alerting for peak events
   - Continuous optimization approach

Create an actionable plan to reduce peak demand charges by 40% within 6 months.
```

**What This Demonstrates**:
- Targeted cost reduction
- Operational optimization
- Phased implementation planning
- Automated monitoring design

---

## Category 4: Predictive Maintenance

### Prompt 4A: Asset Failure Prediction

```
I have uploaded maintenance-records.csv containing our asset maintenance history and failure incidents.

Build a predictive maintenance strategy:

1. Failure pattern analysis:
   - Which asset types fail most frequently?
   - Average time between failures by asset type
   - Seasonal or operational correlations

2. Cost of failures:
   - Emergency repair costs vs. planned maintenance
   - Downtime and service disruption costs
   - Total annual failure costs

3. Predictive indicators:
   - Early warning signs before failures
   - Asset age vs. failure probability
   - Operational stress factors

4. Risk scoring:
   - Current risk score for each critical asset
   - Probability of failure in next 30/60/90 days
   - Prioritized maintenance list

5. Maintenance optimization:
   - Optimal maintenance intervals by asset type
   - Condition-based vs. time-based approaches
   - Spare parts inventory recommendations

6. ROI analysis:
   - Savings from preventing 50% of emergency repairs
   - Reduced downtime value
   - Maintenance cost optimization

7. Implementation roadmap:
   - Quick wins (high-risk assets)
   - Sensor deployment for condition monitoring
   - CMMS integration requirements

Provide 90-day prioritized maintenance schedule with risk mitigation focus.
```

**What This Demonstrates**:
- Predictive analytics and ML
- Risk assessment
- Maintenance optimization
- ROI quantification
- Practical scheduling

**Expected Results**:
- 50-80 assets flagged for preventive action
- 40-60% emergency repair reduction potential
- $2-3M annual savings estimate
- 90-day action plan

---

### Prompt 4B: Pump Performance Optimization

```
Using maintenance-records.csv, analyze pump performance and optimize maintenance strategy.

Focus on:

1. Pump health assessment:
   - Performance degradation over time
   - Energy efficiency trends
   - Vibration and temperature patterns

2. Failure prediction:
   - Pumps at high risk of failure
   - Estimated remaining useful life
   - Warning indicators to monitor

3. Performance optimization:
   - Pumps operating outside optimal range
   - Energy waste from degraded pumps
   - Operational adjustments needed

4. Maintenance strategy:
   - Predictive vs. preventive vs. reactive breakdown
   - Optimal maintenance frequency
   - Rebuild vs. replace analysis

5. Financial impact:
   - Cost of current reactive approach
   - Savings from predictive program
   - Energy savings from performance optimization

6. Action plan:
   - Immediate pump inspections needed (high-risk)
   - Performance tuning opportunities
   - Long-term replacement schedule

Create pump asset management plan with 5-year outlook.
```

**What This Demonstrates**:
- Asset-specific analytics
- Performance optimization
- Long-term planning
- Predictive vs. reactive cost comparison

---

## Category 5: Customer Analytics

### Prompt 5A: Customer Consumption Analysis

```
I have uploaded customer-consumption.csv with customer billing and consumption data.

Perform comprehensive customer analytics:

1. Consumption patterns:
   - Distribution of consumption by customer segment
   - Residential vs. commercial vs. industrial patterns
   - Seasonal variations

2. Anomaly detection:
   - Customers with unusual consumption spikes
   - Potential leaks at customer premises
   - Meter accuracy issues

3. High-bill prediction:
   - Customers likely to receive high bills
   - Consumption trends indicating issues
   - Proactive notification opportunities

4. Revenue analysis:
   - Revenue by customer segment
   - Collection rates and patterns
   - Revenue at risk (delinquent accounts)

5. Customer engagement:
   - Conservation program targeting
   - Customers for demand response programs
   - Education campaign segmentation

6. Forecasting:
   - Customer growth projections
   - Revenue forecasts
   - Infrastructure planning implications

7. Action items:
   - Proactive customer outreach list
   - Leak alert notifications to send
   - Targeted conservation campaigns

Provide customer insights dashboard and proactive engagement plan.
```

**What This Demonstrates**:
- Customer segmentation
- Anomaly detection
- Predictive analytics
- Proactive service
- Revenue optimization

**Expected Results**:
- 200-300 customers with leak indicators
- 50-100 high-bill risk customers
- Targeted engagement lists
- Revenue protection strategies

---

### Prompt 5B: Customer Complaint Analysis

```
Using customer-complaints.csv, analyze service issues and improve customer satisfaction.

Analyze:

1. Complaint patterns:
   - Most common complaint types
   - Temporal trends (improving or worsening?)
   - Geographic clustering of issues

2. Root cause analysis:
   - Underlying infrastructure issues
   - Operational problems
   - Communication gaps

3. Resolution performance:
   - Average resolution time by complaint type
   - Repeat complaints (unresolved issues)
   - Resolution rate trends

4. Customer impact:
   - High-frequency complainers (chronic issues)
   - At-risk customers (likely to leave/protest)
   - Satisfaction drivers

5. Preventive opportunities:
   - Issues we could detect before complaints
   - Proactive communication needs
   - Infrastructure investments needed

6. Service improvement plan:
   - Quick wins (immediate fixes)
   - Process improvements
   - Infrastructure upgrades (prioritized)

7. Monitoring framework:
   - KPIs for complaint reduction
   - Early warning indicators
   - Customer satisfaction tracking

Create action plan to reduce complaints by 50% within 6 months.
```

**What This Demonstrates**:
- Text analytics (complaint categorization)
- Root cause analysis
- Performance tracking
- Improvement planning
- Customer satisfaction focus

---

## Category 6: Demand Forecasting

### Prompt 6A: Short-Term Demand Forecast

```
I have uploaded customer-consumption.csv with historical demand data.

Build a short-term demand forecasting model:

1. Historical demand analysis:
   - Seasonal patterns
   - Day-of-week variations
   - Time-of-day profiles

2. Weather correlation:
   - Temperature impact on demand
   - Rainfall effects
   - Humidity relationships

3. Special events:
   - Holiday patterns
   - Ramadan/religious observance impacts
   - Major event influences

4. Forecast development:
   - 7-day hourly demand forecast
   - 30-day daily demand forecast
   - Confidence intervals

5. Production optimization:
   - Optimal production schedule
   - Reservoir management strategy
   - Energy cost minimization

6. Scenario planning:
   - Hot weather scenario
   - Equipment outage scenario
   - Demand surge response

7. Monitoring and adjustment:
   - Real-time forecast vs. actual tracking
   - Automated adjustment recommendations
   - Alert thresholds for anomalies

Provide production team with actionable 7-day forecast and optimization recommendations.
```

**What This Demonstrates**:
- Time series forecasting
- Multi-variable modeling
- Scenario planning
- Operational optimization
- Real-time monitoring design

**Expected Results**:
- 85-95% forecast accuracy
- Hour-by-hour production schedule
- 10-15% energy cost reduction opportunity
- Reservoir optimization strategy

---

### Prompt 6B: Long-Term Infrastructure Planning

```
Using customer-consumption.csv and growth trends, develop long-term infrastructure capacity plan.

Analyze:

1. Historical growth analysis:
   - Consumption growth rate by area
   - Customer growth trends
   - Per-capita consumption changes

2. Future demand projection:
   - 5-year demand forecast by zone
   - 10-year system-wide projections
   - Confidence ranges

3. Capacity assessment:
   - Current capacity vs. projected demand
   - When will we hit capacity constraints?
   - Geographic capacity gaps

4. Infrastructure requirements:
   - Treatment capacity additions needed
   - Transmission main upgrades
   - Storage expansion requirements
   - Pumping station additions

5. Financial planning:
   - Capital investment schedule
   - Funding requirements
   - Rate impact analysis

6. Scenario analysis:
   - High-growth scenario
   - Conservation program impact
   - Climate change considerations

7. Strategic recommendations:
   - Phased infrastructure plan
   - Demand management strategies
   - Partnership/interconnection opportunities

Create 10-year master plan with capital budget and financing strategy.
```

**What This Demonstrates**:
- Long-term forecasting
- Capacity planning
- Financial modeling
- Strategic planning
- Scenario analysis

---

## Category 7: Regulatory Compliance

### Prompt 7A: Compliance Performance Assessment

```
I have uploaded water-quality-monitoring.csv and distribution-network-performance.csv.

Assess our regulatory compliance performance across all key areas:

1. Water quality compliance:
   - Exceedance rate for each parameter
   - Comparison to regulatory limits
   - Trending (improving or declining?)

2. Service reliability compliance:
   - Pressure standard compliance
   - Service interruption frequency
   - Emergency response times

3. Reporting compliance:
   - Data completeness for required reports
   - Gaps or missing information
   - Report deadlines and status

4. Risk assessment:
   - High-risk compliance areas
   - Probability of violations
   - Potential penalty exposure

5. Improvement priorities:
   - Quick fixes for compliance gaps
   - Systematic improvements needed
   - Investment requirements

6. Automated compliance:
   - Opportunities for automated monitoring
   - Alert and notification setup
   - Report generation automation

7. Audit readiness:
   - Documentation completeness
   - Data quality and traceability
   - Response procedures

Create compliance dashboard and action plan to achieve 100% compliance.
```

**What This Demonstrates**:
- Multi-domain compliance tracking
- Risk assessment
- Gap analysis
- Automation opportunities
- Audit preparation

**Expected Results**:
- 95-98% current compliance rate
- 5-10 areas needing attention
- Automated monitoring setup plan
- Zero-violation roadmap

---

### Prompt 7B: Automated Regulatory Report Generation

```
Using all available data files, generate our quarterly regulatory compliance report.

The report should include:

1. Executive summary:
   - Overall compliance status
   - Key achievements and challenges
   - Corrective actions taken

2. Water quality section:
   - All required parameter monitoring results
   - Exceedance summary and corrective actions
   - Lab testing summary

3. Operational performance:
   - Production and distribution volumes
   - Service reliability metrics
   - Customer complaints and resolution

4. Infrastructure section:
   - Asset condition and maintenance
   - Capital improvements completed
   - Emergency response incidents

5. Financial section:
   - Operating costs and revenues
   - Capital expenditures
   - Rate adjustments (if any)

6. Forward-looking:
   - Planned improvements
   - Anticipated challenges
   - Resource requirements

7. Supporting data:
   - Detailed data tables
   - Charts and visualizations
   - Quality assurance documentation

Format the report according to regulatory requirements with proper sections, tables, and executive sign-off pages.
```

**What This Demonstrates**:
- Comprehensive reporting capability
- Multi-source data integration
- Automated document generation
- Regulatory format compliance
- Professional presentation

---

## Category 8: Integrated Analysis (Advanced Demos)

### Prompt 8A: System-Wide Performance Dashboard

```
I have uploaded all available datasets: water-quality-monitoring.csv, distribution-network-performance.csv, energy-usage.csv, maintenance-records.csv, customer-consumption.csv, and customer-complaints.csv.

Create a comprehensive system-wide performance dashboard that integrates insights from all operational areas:

1. Overall system health score:
   - Composite performance indicator
   - Trending (improving or declining?)
   - Key drivers of performance changes

2. Financial performance:
   - Total costs and revenues
   - Cost per gallon metrics
   - Revenue efficiency
   - Top cost drivers and opportunities

3. Operational excellence:
   - Water quality compliance rate
   - NRW percentage
   - Energy efficiency
   - Asset reliability
   - Customer satisfaction

4. Risk indicators:
   - Regulatory compliance risk
   - Asset failure risk
   - Financial sustainability risk
   - Customer satisfaction risk

5. Interconnected insights:
   - How does energy cost impact overall efficiency?
   - Relationship between asset failures and service quality
   - Correlation between NRW and customer complaints
   - Quality issues and their operational causes

6. Prioritized action plan:
   - Top 10 opportunities for improvement
   - Expected impact of each action
   - Resource requirements
   - Implementation timeline

7. Executive summary:
   - Key metrics and trends
   - Critical issues requiring attention
   - Strategic recommendations

Build an integrated performance management system with drill-down capabilities to underlying data.
```

**What This Demonstrates**:
- Multi-source data integration
- Executive dashboarding
- Cross-functional insights
- Prioritization algorithms
- Strategic decision support
- Full platform capabilities

**Expected Results**:
- Unified performance view
- 10-15 interconnected insights
- Prioritized improvement roadmap
- $10-20M total opportunity value

---

### Prompt 8B: AI-Powered Decision Support System

```
Using all available data, I need an AI decision support system to help optimize our water utility operations.

Please analyze our data and provide:

1. Automated daily operations briefing:
   - Key issues requiring attention today
   - Performance alerts and anomalies
   - Recommended actions

2. What-if scenario analysis:
   - If we reduce pressure by 10 PSI, what happens to energy, NRW, and customer service?
   - If we shift 30% of production to off-peak hours, what are the energy savings?
   - If we invest $5M in pipe replacement, what is the ROI?

3. Predictive insights:
   - What failures are likely in the next 30 days?
   - Which customers will have high bills next month?
   - When will we face capacity constraints?

4. Optimization recommendations:
   - How should we schedule production for minimum cost?
   - Which maintenance activities should we prioritize?
   - Where should we invest capital for maximum impact?

5. Natural language query capability:
   - "What caused the quality exceedance on Station 12 last week?"
   - "Which zones have the highest water loss?"
   - "How much money are we losing to NRW?"
   - "What is our energy cost trend?"

6. Automated alerts and notifications:
   - Quality exceedances
   - Unusual consumption patterns
   - Asset failure predictions
   - Regulatory compliance issues

Create an intelligent operations center that gives us real-time visibility and AI-powered recommendations.
```

**What This Demonstrates**:
- AI-powered decision support
- Natural language processing
- Predictive capabilities
- Scenario modeling
- Automated intelligence
- Full facilis.ai platform power

---

## Demo Prompt Selection Guide

### For 15-Minute Demo (Choose 2-3 Prompts):
1. **Prompt 2A** (NRW Analysis) - High financial impact
2. **Prompt 3A** (Energy Optimization) - Clear savings
3. **Prompt 5A** (Customer Analytics) - Proactive service

### For 30-Minute Demo (Choose 4-5 Prompts):
- Start with **Prompt 8A** (Integrated Dashboard) - Show the big picture
- Then **Prompt 2A** (NRW Analysis) - Dive into water loss
- Then **Prompt 4A** (Predictive Maintenance) - Show ML capabilities
- Then **Prompt 7B** (Report Generation) - Demonstrate automation
- Close with **Prompt 8B** (AI Decision Support) - Future vision

### For Technical Audience:
- **Prompt 4A** (Predictive Maintenance)
- **Prompt 6A** (Demand Forecasting)
- **Prompt 8B** (AI Decision Support)

### For Executive Audience:
- **Prompt 8A** (Integrated Dashboard)
- **Prompt 2A** (NRW Analysis)
- **Prompt 3A** (Energy Optimization)

### For Operations Team:
- **Prompt 1A** (Water Quality)
- **Prompt 2B** (Pressure Optimization)
- **Prompt 4B** (Pump Performance)

---

## Tips for Effective Demo Delivery

1. **Set Context**: Before pasting prompt, explain the business problem
2. **Show the Data**: Briefly show the CSV file structure
3. **Explain the Prompt**: Walk through what you're asking facilis.ai to do
4. **Let It Work**: Paste prompt and let AI process while explaining capabilities
5. **Review Results**: Walk through insights, highlight key findings
6. **Connect to Value**: "This analysis would normally take your team 2-3 weeks. We just did it in 2 minutes."

---

**Next Steps**: Load synthetic datasets and try these prompts to familiarize yourself with expected outputs.
