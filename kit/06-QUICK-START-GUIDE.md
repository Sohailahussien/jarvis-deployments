# Quick Start Guide for Sarooj Water Team

## Welcome!

This guide gets you up and running with the facilis.ai demo kit in 30 minutes or less. Follow these steps to prepare for your first demo.

---

## Step 1: Familiarize Yourself with the Kit (10 minutes)

### What's Included

You have 6 documents and 6 datasets:

**Documents**:
1. `00-OVERVIEW.md` - This overview (you're reading it now)
2. `01-COMPANY-RESEARCH.md` - Industry insights and customer pain points
3. `02-USE-CASES.md` - 7 detailed use case scenarios
4. `03-DEMO-PROMPTS.md` - 15+ ready-to-use prompts
5. `04-DEMO-SCRIPT.md` - Complete presentation scripts
6. `05-OBJECTION-HANDLING.md` - Responses to common objections
7. `06-QUICK-START-GUIDE.md` - This guide

**Datasets** (in `data/` folder):
1. `water-quality-monitoring.csv` - 69,120 quality measurements
2. `distribution-network-performance.csv` - 46,080 network records
3. `energy-usage.csv` - 51,840 energy consumption records
4. `maintenance-records.csv` - 9,772 maintenance events
5. `customer-consumption.csv` - 40,000 customer billing records
6. `customer-complaints.csv` - 2,000 service complaints

### Quick Read Priority

Before your first demo, read these in order:
1. **01-COMPANY-RESEARCH.md** (10 min) - Understand the industry context
2. **04-DEMO-SCRIPT.md** - Script 1 (5 min) - Learn the executive demo flow
3. **03-DEMO-PROMPTS.md** - Prompts 2A, 3A, 8A (5 min) - Your core demo prompts

That's 20 minutes of reading to be demo-ready.

---

## Step 2: Access facilis.ai Platform (2 minutes)

### Log In
1. Go to [facilis.ai platform URL]
2. Log in with your Sarooj Water credentials
3. You'll see your workspace dashboard

### Upload Demo Data
1. Click "Upload Data" or "New Project"
2. Navigate to the `data/` folder in this kit
3. Upload all 6 CSV files
4. Wait for processing to complete (usually 1-2 minutes)

### Verify Upload
- Check that all 6 files appear in your data sources
- Click on each file to preview - ensure data loaded correctly

---

## Step 3: Run Your First Demo Prompt (5 minutes)

Let's practice with a simple but impressive analysis.

### Test Prompt: NRW Analysis

1. In facilis.ai, ensure `distribution-network-performance.csv` is loaded
2. Copy this prompt from `03-DEMO-PROMPTS.md` (Prompt 2A):

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

3. Paste into facilis.ai chat/prompt interface
4. Press Enter and watch the AI work
5. Review the results - you should see detailed analysis with charts, insights, and recommendations

### What to Notice
- Speed: Analysis completes in 60-120 seconds
- Depth: Multi-faceted analysis, not just basic stats
- Actionability: Specific recommendations, not generic insights
- Visualizations: Charts and tables automatically generated

### If It Works
Congratulations! You've just run your first AI-powered water utility analysis. Now you're ready for real demos.

### If Something Doesn't Work
- Check that the CSV file uploaded successfully
- Ensure you copied the entire prompt
- Try a simpler question first: "Summarize the data in distribution-network-performance.csv"
- Contact facilis.ai support if issues persist

---

## Step 4: Prepare for Your First Demo (10 minutes)

### Pre-Demo Checklist

**24 Hours Before**:
- [ ] Confirm prospect's industry segment (municipal, desalination, industrial)
- [ ] Identify their #1 pain point (water loss, energy costs, compliance, etc.)
- [ ] Choose 2-3 use cases from `02-USE-CASES.md` that match their needs
- [ ] Select corresponding prompts from `03-DEMO-PROMPTS.md`
- [ ] Review the appropriate demo script from `04-DEMO-SCRIPT.md`
- [ ] Test your selected prompts in facilis.ai
- [ ] Prepare your opening hook (see script options)

**1 Hour Before**:
- [ ] Re-upload all datasets to facilis.ai (fresh session)
- [ ] Test internet connection and screen sharing
- [ ] Have demo script open in separate window
- [ ] Have objection handling guide handy
- [ ] Clear browser cache and close unnecessary tabs
- [ ] Do a 5-minute dry run of your opening

**At Demo Start**:
- [ ] Introduce yourself and Sarooj Water partnership
- [ ] Set expectations (what you'll show, how long)
- [ ] Ask one discovery question before diving in
- [ ] Be ready to adjust based on their interests

---

## Your First Demo: The 15-Minute Executive Briefing

Use this structure for your first demo. It's proven, impactful, and low-risk.

### Opening (2 min)
"Thank you for your time today. I'm [Name] from Sarooj Water, and we're partnering with facilis.ai to bring AI-powered operational intelligence to water utilities in the region.

Before I show you what we can do, let me ask: What's your biggest operational challenge right now? [LISTEN]

Great. Let me show you how facilis.ai addresses challenges exactly like that."

### Demo 1: NRW Analysis (4 min)
- Upload `distribution-network-performance.csv` (if not pre-loaded)
- Use Prompt 2A
- While AI processes: "This analysis typically takes your team 2-3 weeks. Watch how fast AI works..."
- Review results: Highlight dollar losses, prioritized zones, ROI
- Connect to their pain point

### Demo 2: Energy Optimization (4 min)
- Upload `energy-usage.csv` (if not pre-loaded)
- Use Prompt 3A
- Explain what AI is analyzing
- Review results: Show savings opportunities, efficiency issues
- Emphasize quick wins vs. capital investments

### Demo 3: Integrated View (3 min)
- Upload all remaining datasets
- Use Prompt 8A (simplified version)
- "Now watch what happens when we connect all operational data..."
- Show cross-functional insights
- Highlight total opportunity value

### Closing (2 min)
"In 15 minutes, we've identified [X] million in opportunities. This is the power of AI-driven operational intelligence.

Three things to remember:
1. Speed - insights in minutes, not months
2. Intelligence - AI finds what humans miss
3. Action - specific recommendations, not reports

I'd like to propose a 30-day pilot focused on [their top pain point]. We'll prove the value before you commit.

What questions do you have?"

---

## Common First Demo Mistakes to Avoid

### Mistake 1: Showing Too Much
**Problem**: Trying to demonstrate every feature and capability
**Solution**: Stick to 2-3 use cases that solve their specific problems

### Mistake 2: Not Setting Context
**Problem**: Jumping straight into technical details
**Solution**: Start with the business problem, then show the solution

### Mistake 3: Reading the Screen
**Problem**: Silently letting AI process while you wait awkwardly
**Solution**: While AI works, explain what it's doing and why it matters

### Mistake 4: Not Quantifying Value
**Problem**: Showing insights without connecting to dollars
**Solution**: Always translate findings to financial impact

### Mistake 5: Weak Closing
**Problem**: Ending with "So... any questions?" and no next steps
**Solution**: Propose a specific next action (pilot, technical review, etc.)

---

## Demo Environment Setup Tips

### Technical Setup
- Use two monitors if possible: demo on one, script on the other
- Close email, Slack, and other notifications
- Use incognito/private browser window for clean demo
- Have backup plan if internet fails (screenshots of previous results)

### Visual Setup
- Increase browser font size for better screen sharing visibility
- Use full-screen mode in facilis.ai for cleaner look
- Have company logo or professional background if on video call

### Mental Setup
- Remember: You're the expert. The AI is your tool.
- Confidence comes from practice - run through 2-3 times before first real demo
- It's okay to say "Great question - let me ask the AI that right now"
- Prospects are more impressed by problem-solving than perfection

---

## Customizing Demos for Different Audiences

### For Executives (CFO, CEO, Director)
- Focus: Financial impact, strategic value, competitive advantage
- Use: Scripts 1 (Executive Briefing)
- Prompts: 2A (NRW), 3A (Energy), 8A (Integrated)
- Time: 15-20 minutes
- Tone: Business outcomes, minimal technical detail

### For Operations Managers
- Focus: Daily problem-solving, efficiency, ease of use
- Use: Script 3 (Operations Demo)
- Prompts: 1A (Quality), 4A (Maintenance), 5A (Customers)
- Time: 20-30 minutes
- Tone: Practical, operational, hands-on

### For Technical Staff (Engineers, IT)
- Focus: Analytical depth, data handling, integration
- Use: Script 2 (Technical Deep Dive)
- Prompts: 1B (Investigation), 4A (Predictive), 6A (Forecasting)
- Time: 30-45 minutes
- Tone: Technical, detailed, methodology-focused

---

## After the Demo: Next Steps

### Immediate Follow-Up (Same Day)
1. Send thank you email within 2 hours
2. Attach 1-page summary of findings from the demo
3. Propose specific next steps with dates
4. Include your contact info and availability

### Email Template

Subject: facilis.ai Demo Follow-Up - [Company Name]

Dear [Name],

Thank you for your time today. As we discussed, facilis.ai identified significant opportunities for [Company Name]:

- [Specific finding 1] - Potential savings: $X
- [Specific finding 2] - Potential savings: $Y
- [Specific finding 3] - Potential savings: $Z

Total identified opportunity: $[Total]

Next Steps:
1. [Specific action] - [Who] by [When]
2. [Specific action] - [Who] by [When]
3. [Specific action] - [Who] by [When]

I'll follow up on [specific date] to answer any questions and discuss moving forward with a pilot program.

Best regards,
[Your Name]
Sarooj Water | facilis.ai Partnership
[Contact Info]

### Schedule Follow-Up
- Set reminder for 3-5 days out
- If no response in 1 week, send gentle follow-up
- If no response in 2 weeks, try different contact (if available)
- After 3 weeks, consider them unresponsive and move to nurture track

---

## Building Your Demo Skills

### Practice Schedule
**Week 1**: Run each core prompt 3 times, review results
**Week 2**: Practice Script 1 end-to-end 5 times (record yourself)
**Week 3**: Practice objection responses (role play with colleague)
**Week 4**: Shadow an experienced rep's demo (if possible)

### Continuous Improvement
After each demo:
- Note what worked well
- Note what could improve
- Update your personal demo script
- Add new prompts that prospects requested
- Share learnings with team

### Knowledge Building
- Read one use case from `02-USE-CASES.md` per day
- Learn one new prompt per week
- Study one water industry article per week (apply insights to demos)
- Watch competitor demos (understand differentiation)

---

## Troubleshooting Common Issues

### Issue: AI Results Don't Match Demo Script Expectations
**Cause**: AI is probabilistic; results vary slightly
**Solution**: Focus on types of insights, not exact numbers. Say "The AI found similar patterns to what we typically see..."

### Issue: Prospect Asks Technical Question You Can't Answer
**Response**: "That's a great technical question. Let me connect you with our technical team who can give you the detailed answer you need. Can I set up a technical review session?"

### Issue: Demo Runs Long, Losing Attention
**Solution**: "I see we're running short on time. Let me jump to the key finding..." Then show Prompt 8A summary and close.

### Issue: Internet Connection Problems
**Solution**: Have screenshots/screen recording of previous demo runs as backup. "Let me show you results from a similar analysis we ran..."

### Issue: Prospect Seems Uninterested
**Solution**: Stop the demo. Ask: "I want to make sure this is valuable for you. What would be most useful to see?" Adjust on the fly.

---

## Resources and Support

### Internal Resources
- Demo kit: This folder (projects/sarooj-demo-kit)
- Sarooj Water team: [Contact info]
- facilis.ai support: [Support email/channel]

### External Resources
- Water industry news: [Suggested publications]
- GCC water utilities list: [Resource]
- Competitive intelligence: [Internal document]

### Getting Help
- Technical issues: [facilis.ai support channel]
- Demo strategy: [Sarooj Water contact]
- Sales questions: [Sales leadership]

---

## Success Metrics

Track these for each demo:

**Engagement Metrics**:
- [ ] Prospect asked questions during demo
- [ ] Prospect requested specific analysis
- [ ] Demo went into overtime (in a good way)
- [ ] Prospect brought others to see it

**Outcome Metrics**:
- [ ] Agreed to next meeting/step
- [ ] Requested pilot proposal
- [ ] Introduced to technical team
- [ ] Identified specific budget/timeline

**Learning Metrics**:
- [ ] Learned new prospect pain point
- [ ] Discovered new use case
- [ ] Got feedback on messaging
- [ ] Identified competitive intelligence

---

## Your First Week Plan

### Monday: Setup & Practice
- Review all documents (2 hours)
- Upload datasets to facilis.ai
- Run Prompts 2A, 3A, 8A three times each
- Record yourself delivering the opening

### Tuesday: Deep Dive
- Read all use cases in detail
- Try 5 different prompts
- Review objection handling guide
- Practice one complete demo script

### Wednesday: Refinement
- Customize script for your style
- Prepare your "greatest hits" prompt list
- Create your personal demo checklist
- Set up demo environment (bookmarks, templates)

### Thursday: Role Play
- Find a colleague to be a prospect
- Deliver complete 15-minute demo
- Get feedback
- Adjust based on feedback

### Friday: Ready!
- Final run-through
- Prepare demo scheduling message
- Reach out to first prospects
- Schedule your first demos for next week

---

## Final Advice

### Remember:
1. **You're the expert**: The prospect knows water, you know facilis.ai, together you solve problems
2. **Confidence comes from reps**: Every demo makes you better
3. **Focus on value**: They don't buy AI, they buy solutions to problems
4. **Listen more than talk**: Best demos are conversations, not presentations
5. **Have fun**: You're showing people how to work smarter - that's exciting!

### You're Ready When:
- [ ] You can deliver a 15-minute demo without notes
- [ ] You can explain the value in one sentence
- [ ] You can run 3 core prompts from memory
- [ ] You can handle 5 common objections
- [ ] You're excited to show this to prospects

---

## Quick Reference Card

**Print this and keep it handy during demos**

### Core Prompts
- **NRW**: Prompt 2A - Water loss analysis
- **Energy**: Prompt 3A - Cost optimization
- **Integrated**: Prompt 8A - System-wide view

### Key Messages
- Speed: "Minutes, not months"
- Intelligence: "AI finds what humans miss"
- Action: "Recommendations, not reports"

### Opening Hook
"GCC utilities lose 15-35% of water. That's $15-40M annually. What if you could recover half?"

### Closing Question
"What's the biggest operational challenge I can help you solve first?"

### Objection Response Framework
1. Acknowledge
2. Clarify
3. Address with evidence
4. Check resolution
5. Move forward

### Next Steps to Propose
- 30-day pilot on their top priority
- Technical review with their IT team
- ROI analysis with their finance team
- Stakeholder demo for decision-makers

---

**You've got this! The kit provides everything you need. Now go show prospects how facilis.ai transforms water utility operations.**

**Questions?** Contact [Support contact info]

**Ready to schedule your first demo?** Let's go!

---

Last Updated: December 2025
Version: 1.0
Prepared for: Sarooj Water Partnership Team
