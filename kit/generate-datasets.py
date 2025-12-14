#!/usr/bin/env python3
"""
Generate synthetic water utility datasets for facilis.ai demos
Creates realistic data that demonstrates platform capabilities
"""

import csv
import random
import datetime
from pathlib import Path

# Set random seed for reproducibility
random.seed(42)

# Output directory
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

print("Generating synthetic water utility datasets...")

# ============================================================================
# Dataset 1: Water Quality Monitoring
# ============================================================================
print("\n1. Generating water-quality-monitoring.csv...")

quality_data = []
start_date = datetime.datetime(2024, 1, 1, 0, 0)
monitoring_stations = [
    "Station-01-Downtown", "Station-02-Industrial", "Station-03-Residential-North",
    "Station-04-Residential-South", "Station-05-Coastal", "Station-06-Airport",
    "Station-07-Hospital", "Station-08-University", "Station-09-Mall",
    "Station-10-Port", "Station-11-Suburb-East", "Station-12-Suburb-West"
]

# Generate 8 months of hourly data
for hours in range(8 * 30 * 24):  # ~5,760 records per station
    timestamp = start_date + datetime.timedelta(hours=hours)

    for station_id, station in enumerate(monitoring_stations, 1):
        # Base values with station-specific characteristics
        base_chlorine = 1.2 + (station_id * 0.1) + random.gauss(0, 0.15)
        base_ph = 7.3 + random.gauss(0, 0.15)
        base_turbidity = 0.5 + random.gauss(0, 0.3)
        base_temp = 22 + 5 * abs(random.gauss(0, 1))
        base_conductivity = 450 + random.gauss(0, 30)

        # Add time-of-day patterns
        hour = timestamp.hour
        if 6 <= hour <= 9:  # Morning rush
            base_chlorine -= 0.1
            base_turbidity += 0.2
        elif 18 <= hour <= 21:  # Evening rush
            base_chlorine -= 0.15
            base_turbidity += 0.3

        # Add day-of-week patterns (lower usage on Friday/Saturday)
        if timestamp.weekday() in [4, 5]:
            base_chlorine += 0.1
            base_turbidity -= 0.1

        # Add seasonal patterns (summer = higher temp, lower quality)
        month = timestamp.month
        if month in [6, 7, 8]:  # Summer
            base_temp += 5
            base_turbidity += 0.3
            base_conductivity += 20

        # Inject realistic quality issues
        # Issue 1: Station 12 has chronic low chlorine
        if station == "Station-12-Suburb-West":
            base_chlorine -= 0.4
            if random.random() < 0.05:  # 5% exceedance rate
                base_chlorine = random.uniform(0.1, 0.19)

        # Issue 2: Station 2 (industrial) has turbidity spikes
        if station == "Station-02-Industrial":
            if random.random() < 0.02:  # 2% spike rate
                base_turbidity = random.uniform(5.5, 12.0)

        # Issue 3: Station 5 (coastal) has high conductivity
        if station == "Station-05-Coastal":
            base_conductivity += 80
            if random.random() < 0.03:
                base_conductivity = random.uniform(800, 950)

        # Issue 4: pH excursion event on Aug 15
        if timestamp.date() == datetime.date(2024, 8, 15):
            if 14 <= hour <= 18:
                if station in ["Station-03-Residential-North", "Station-11-Suburb-East"]:
                    base_ph = random.uniform(8.6, 9.2)

        # Issue 5: Major turbidity event on Aug 15 (rainfall correlation)
        if timestamp.date() == datetime.date(2024, 8, 15):
            if 10 <= hour <= 20:
                base_turbidity += random.uniform(3.0, 8.0)

        # Ensure realistic ranges
        chlorine = max(0.0, min(5.0, base_chlorine))
        ph = max(6.0, min(9.0, base_ph))
        turbidity = max(0.0, min(20.0, base_turbidity))
        temperature = max(10.0, min(35.0, base_temp))
        conductivity = max(200.0, min(1000.0, base_conductivity))

        # Compliance flags
        chlorine_ok = 0.2 <= chlorine <= 4.0
        ph_ok = 6.5 <= ph <= 8.5
        turbidity_ok = turbidity < 5.0

        quality_data.append({
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'station': station,
            'chlorine_mg_l': round(chlorine, 3),
            'ph': round(ph, 2),
            'turbidity_ntu': round(turbidity, 2),
            'temperature_c': round(temperature, 1),
            'conductivity_us_cm': round(conductivity, 1),
            'chlorine_compliant': 'Yes' if chlorine_ok else 'No',
            'ph_compliant': 'Yes' if ph_ok else 'No',
            'turbidity_compliant': 'Yes' if turbidity_ok else 'No',
            'overall_compliant': 'Yes' if (chlorine_ok and ph_ok and turbidity_ok) else 'No'
        })

    # Progress indicator
    if hours % 1000 == 0:
        print(f"  Generated {hours} hours of data...")

# Write to CSV
with open(DATA_DIR / 'water-quality-monitoring.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=quality_data[0].keys())
    writer.writeheader()
    writer.writerows(quality_data)

print(f"  Created water-quality-monitoring.csv with {len(quality_data):,} records")

# ============================================================================
# Dataset 2: Distribution Network Performance
# ============================================================================
print("\n2. Generating distribution-network-performance.csv...")

network_data = []
pressure_zones = [
    "Zone-A-Downtown", "Zone-B-North", "Zone-C-South", "Zone-D-East",
    "Zone-E-West", "Zone-F-Industrial", "Zone-G-Coastal", "Zone-H-Hills"
]

# Generate 8 months of hourly data
for hours in range(8 * 30 * 24):
    timestamp = start_date + datetime.timedelta(hours=hours)

    for zone_id, zone in enumerate(pressure_zones, 1):
        # Base values
        base_flow = 500 + (zone_id * 100) + random.gauss(0, 50)
        base_pressure = 55 + random.gauss(0, 5)
        base_consumption = base_flow * 0.75  # Assume 25% NRW average

        # Time-of-day patterns
        hour = timestamp.hour
        if 6 <= hour <= 9:  # Morning peak
            base_flow *= 1.4
            base_consumption *= 1.5
            base_pressure -= 8
        elif 18 <= hour <= 21:  # Evening peak
            base_flow *= 1.3
            base_consumption *= 1.4
            base_pressure -= 6
        elif 0 <= hour <= 5:  # Minimum night flow
            base_flow *= 0.4
            base_consumption *= 0.3
            base_pressure += 5

        # Day-of-week patterns
        if timestamp.weekday() in [4, 5]:  # Weekend
            base_flow *= 0.85
            base_consumption *= 0.80

        # Seasonal patterns
        month = timestamp.month
        if month in [6, 7, 8]:  # Summer - higher consumption
            base_flow *= 1.25
            base_consumption *= 1.30

        # Zone-specific NRW issues
        if zone == "Zone-C-South":  # High NRW zone
            base_consumption = base_flow * 0.60  # 40% NRW
        elif zone == "Zone-G-Coastal":  # Aging infrastructure
            base_consumption = base_flow * 0.65  # 35% NRW
        elif zone == "Zone-H-Hills":  # Good condition
            base_consumption = base_flow * 0.88  # 12% NRW

        # Inject leak events
        if zone == "Zone-C-South":
            if datetime.date(2024, 7, 1) <= timestamp.date() <= datetime.date(2024, 8, 31):
                # Major leak developing
                leak_flow = (timestamp.date() - datetime.date(2024, 7, 1)).days * 2
                base_flow += leak_flow
                base_consumption = base_flow * 0.50  # Worsening NRW
                base_pressure -= 3

        # Pressure issues
        if zone == "Zone-H-Hills":  # High elevation
            base_pressure -= 15
            if base_pressure < 35:
                base_pressure = random.uniform(32, 38)  # Service pressure issues

        # Over-pressure issue
        if zone == "Zone-A-Downtown":
            base_pressure += 20  # Excessive pressure = energy waste + leaks

        # Ensure realistic ranges
        flow_rate = max(0, base_flow)
        pressure = max(20, min(100, base_pressure))
        consumption = max(0, min(flow_rate, base_consumption))
        nrw_pct = ((flow_rate - consumption) / flow_rate * 100) if flow_rate > 0 else 0

        network_data.append({
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'zone': zone,
            'flow_rate_gpm': round(flow_rate, 1),
            'pressure_psi': round(pressure, 1),
            'billed_consumption_gpm': round(consumption, 1),
            'nrw_gpm': round(flow_rate - consumption, 1),
            'nrw_percent': round(nrw_pct, 2),
            'pressure_compliant': 'Yes' if 40 <= pressure <= 80 else 'No'
        })

    if hours % 1000 == 0:
        print(f"  Generated {hours} hours of data...")

# Write to CSV
with open(DATA_DIR / 'distribution-network-performance.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=network_data[0].keys())
    writer.writeheader()
    writer.writerows(network_data)

print(f"  Created distribution-network-performance.csv with {len(network_data):,} records")

# ============================================================================
# Dataset 3: Energy Usage
# ============================================================================
print("\n3. Generating energy-usage.csv...")

energy_data = []
facilities = [
    "Main-Treatment-Plant", "North-Pumping-Station", "South-Pumping-Station",
    "Desalination-Plant", "Booster-Station-1", "Booster-Station-2",
    "Admin-Building", "Laboratory", "Operations-Center"
]

# Generate 8 months of hourly data
for hours in range(8 * 30 * 24):
    timestamp = start_date + datetime.timedelta(hours=hours)

    for facility_id, facility in enumerate(facilities, 1):
        # Base energy consumption (kW)
        if "Treatment" in facility or "Desalination" in facility:
            base_energy = 1200 + random.gauss(0, 80)
        elif "Pumping" in facility or "Booster" in facility:
            base_energy = 450 + random.gauss(0, 40)
        else:  # Admin buildings
            base_energy = 25 + random.gauss(0, 5)

        # Time-of-day patterns (follows water demand)
        hour = timestamp.hour
        if 6 <= hour <= 9:  # Morning peak
            base_energy *= 1.5
        elif 18 <= hour <= 21:  # Evening peak
            base_energy *= 1.4
        elif 0 <= hour <= 5:  # Night
            base_energy *= 0.6

        # Admin buildings have different patterns
        if facility in ["Admin-Building", "Laboratory", "Operations-Center"]:
            if 8 <= hour <= 17:  # Business hours
                base_energy *= 3.0
            else:
                base_energy *= 0.3

        # Weekend patterns
        if timestamp.weekday() in [4, 5]:
            if facility in ["Admin-Building", "Laboratory"]:
                base_energy *= 0.2
            else:
                base_energy *= 0.85

        # Seasonal patterns (summer cooling)
        month = timestamp.month
        if month in [6, 7, 8]:
            if facility in ["Admin-Building", "Laboratory", "Operations-Center"]:
                base_energy *= 1.8  # AC load
            else:
                base_energy *= 1.15  # Higher production

        # Energy rate (time-of-use)
        if 14 <= hour <= 20:  # Peak hours
            energy_rate = 0.18
        elif 6 <= hour < 14 or 20 < hour <= 23:  # Mid-peak
            energy_rate = 0.12
        else:  # Off-peak
            energy_rate = 0.08

        # Inefficiency issues
        if facility == "North-Pumping-Station":
            base_energy *= 1.25  # 25% inefficient

        if facility == "Desalination-Plant":
            # Efficiency degradation over time
            days_elapsed = (timestamp.date() - start_date.date()).days
            efficiency_loss = 1 + (days_elapsed / 365) * 0.05  # 5% per year
            base_energy *= efficiency_loss

        # Calculate metrics
        energy_kwh = max(0, base_energy)
        energy_cost = energy_kwh * energy_rate

        # Estimate water production for production facilities
        if "Treatment" in facility or "Desalination" in facility:
            water_produced = energy_kwh * 0.5  # gallons per kWh
        elif "Pumping" in facility or "Booster" in facility:
            water_produced = energy_kwh * 1.2
        else:
            water_produced = 0

        energy_efficiency = water_produced / energy_kwh if energy_kwh > 0 and water_produced > 0 else 0

        energy_data.append({
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'facility': facility,
            'energy_consumption_kwh': round(energy_kwh, 2),
            'energy_cost_usd': round(energy_cost, 2),
            'energy_rate_per_kwh': round(energy_rate, 3),
            'rate_period': 'Peak' if energy_rate == 0.18 else ('Mid' if energy_rate == 0.12 else 'Off-Peak'),
            'water_produced_gallons': round(water_produced, 1) if water_produced > 0 else None,
            'energy_efficiency_gal_per_kwh': round(energy_efficiency, 3) if energy_efficiency > 0 else None
        })

    if hours % 1000 == 0:
        print(f"  Generated {hours} hours of data...")

# Write to CSV
with open(DATA_DIR / 'energy-usage.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=energy_data[0].keys())
    writer.writeheader()
    writer.writerows(energy_data)

print(f"  Created energy-usage.csv with {len(energy_data):,} records")

# ============================================================================
# Dataset 4: Maintenance Records
# ============================================================================
print("\n4. Generating maintenance-records.csv...")

maintenance_data = []
asset_types = ["Pump", "Valve", "Motor", "Pipe-Section", "Chlorinator", "Filter", "Sensor", "Meter"]
maintenance_types = ["Preventive", "Corrective", "Emergency", "Inspection", "Calibration"]
failure_modes = ["Bearing-Failure", "Seal-Leak", "Corrosion", "Electrical-Fault", "Blockage",
                 "Wear", "Calibration-Drift", "Software-Error", "Mechanical-Break"]

asset_id_counter = 1
for asset_type in asset_types:
    num_assets = random.randint(80, 150)

    for asset_num in range(num_assets):
        asset_id = f"{asset_type}-{asset_id_counter:04d}"
        asset_id_counter += 1

        # Asset characteristics
        install_date = start_date - datetime.timedelta(days=random.randint(365, 3650))
        age_years = (start_date - install_date).days / 365

        # Generate maintenance history
        num_events = random.randint(3, 20)
        last_maintenance = install_date

        for event_num in range(num_events):
            # Time since last maintenance
            days_since = random.randint(30, 180)
            event_date = last_maintenance + datetime.timedelta(days=days_since)

            if event_date > start_date + datetime.timedelta(days=240):
                break

            # Maintenance type probabilities
            if days_since < 60:
                maint_type = random.choices(maintenance_types, weights=[10, 40, 40, 5, 5])[0]
            elif days_since < 120:
                maint_type = random.choices(maintenance_types, weights=[60, 30, 5, 3, 2])[0]
            else:
                maint_type = random.choices(maintenance_types, weights=[70, 20, 5, 3, 2])[0]

            # Older assets have more issues
            if age_years > 10:
                if random.random() < 0.3:
                    maint_type = "Corrective"
                if random.random() < 0.1:
                    maint_type = "Emergency"

            # Failure mode (if applicable)
            failure_mode = random.choice(failure_modes) if maint_type in ["Corrective", "Emergency"] else None

            # Downtime
            if maint_type == "Emergency":
                downtime = random.uniform(4, 48)
            elif maint_type == "Corrective":
                downtime = random.uniform(1, 12)
            elif maint_type == "Preventive":
                downtime = random.uniform(0.5, 4)
            else:
                downtime = random.uniform(0.25, 2)

            # Cost
            if maint_type == "Emergency":
                cost = random.uniform(5000, 25000)
            elif maint_type == "Corrective":
                cost = random.uniform(1000, 8000)
            elif maint_type == "Preventive":
                cost = random.uniform(200, 1500)
            else:
                cost = random.uniform(100, 500)

            # Parts replaced
            parts_replaced = random.choice([True, False]) if maint_type in ["Corrective", "Emergency"] else False

            maintenance_data.append({
                'asset_id': asset_id,
                'asset_type': asset_type,
                'install_date': install_date.strftime('%Y-%m-%d'),
                'age_years': round(age_years + (event_date - start_date).days / 365, 1),
                'maintenance_date': event_date.strftime('%Y-%m-%d'),
                'maintenance_type': maint_type,
                'failure_mode': failure_mode,
                'downtime_hours': round(downtime, 1),
                'cost_usd': round(cost, 2),
                'parts_replaced': 'Yes' if parts_replaced else 'No',
                'priority': 'Critical' if maint_type == "Emergency" else ('High' if maint_type == "Corrective" else 'Normal'),
                'completed': 'Yes'
            })

            last_maintenance = event_date

# Add some pending maintenance
for i in range(50):
    asset_id = f"{random.choice(asset_types)}-{random.randint(1, asset_id_counter):04d}"
    scheduled_date = start_date + datetime.timedelta(days=random.randint(250, 280))

    maintenance_data.append({
        'asset_id': asset_id,
        'asset_type': asset_id.split('-')[0],
        'install_date': None,
        'age_years': None,
        'maintenance_date': scheduled_date.strftime('%Y-%m-%d'),
        'maintenance_type': 'Preventive',
        'failure_mode': None,
        'downtime_hours': None,
        'cost_usd': None,
        'parts_replaced': None,
        'priority': 'Normal',
        'completed': 'Scheduled'
    })

# Sort by date
maintenance_data.sort(key=lambda x: x['maintenance_date'])

# Write to CSV
with open(DATA_DIR / 'maintenance-records.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=maintenance_data[0].keys())
    writer.writeheader()
    writer.writerows(maintenance_data)

print(f"  Created maintenance-records.csv with {len(maintenance_data):,} records")

# ============================================================================
# Dataset 5: Customer Consumption
# ============================================================================
print("\n5. Generating customer-consumption.csv...")

consumption_data = []
customer_types = ["Residential", "Commercial", "Industrial", "Government"]

# Generate monthly data for 5000 customers over 8 months
num_customers = 5000
for customer_id in range(1, num_customers + 1):
    customer_type = random.choices(customer_types, weights=[70, 20, 7, 3])[0]

    # Base consumption by type (gallons/month)
    if customer_type == "Residential":
        base_consumption = random.uniform(3000, 12000)
    elif customer_type == "Commercial":
        base_consumption = random.uniform(15000, 50000)
    elif customer_type == "Industrial":
        base_consumption = random.uniform(100000, 500000)
    else:  # Government
        base_consumption = random.uniform(20000, 80000)

    for month in range(1, 9):
        billing_date = datetime.date(2024, month, random.randint(1, 28))

        # Monthly consumption with variations
        consumption = base_consumption * random.uniform(0.8, 1.2)

        # Seasonal adjustment (summer higher)
        if month in [6, 7, 8]:
            consumption *= random.uniform(1.3, 1.6)

        # Inject anomalies
        # 1. Some residential customers have leaks
        if customer_type == "Residential" and random.random() < 0.03:
            consumption *= random.uniform(2.5, 5.0)  # Major leak

        # 2. Some customers have declining consumption (conservation/vacancy)
        if random.random() < 0.05:
            consumption *= random.uniform(0.2, 0.5)

        # Calculate bill
        if customer_type == "Residential":
            rate = 2.50  # $ per 1000 gallons
        elif customer_type == "Commercial":
            rate = 3.00
        elif customer_type == "Industrial":
            rate = 2.80
        else:
            rate = 2.20

        bill_amount = (consumption / 1000) * rate + 15.00  # Base fee

        # Payment status
        payment_status = random.choices(
            ["Paid", "Pending", "Overdue"],
            weights=[85, 10, 5]
        )[0]

        consumption_data.append({
            'customer_id': f"CUST-{customer_id:05d}",
            'customer_type': customer_type,
            'billing_date': billing_date.strftime('%Y-%m-%d'),
            'billing_period': f"{billing_date.year}-{billing_date.month:02d}",
            'consumption_gallons': round(consumption, 0),
            'bill_amount_usd': round(bill_amount, 2),
            'payment_status': payment_status,
            'rate_per_1000_gal': rate
        })

    if customer_id % 500 == 0:
        print(f"  Generated data for {customer_id} customers...")

# Write to CSV
with open(DATA_DIR / 'customer-consumption.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=consumption_data[0].keys())
    writer.writeheader()
    writer.writerows(consumption_data)

print(f"  Created customer-consumption.csv with {len(consumption_data):,} records")

# ============================================================================
# Dataset 6: Customer Complaints
# ============================================================================
print("\n6. Generating customer-complaints.csv...")

complaint_data = []
complaint_types = [
    "High-Bill", "Low-Pressure", "Water-Quality", "Billing-Error", "Leak-Reported",
    "Service-Interruption", "Meter-Issue", "Customer-Service", "Connection-Request", "Other"
]

priorities = ["Low", "Medium", "High", "Critical"]
statuses = ["Open", "In-Progress", "Resolved", "Closed"]

# Generate 2000 complaints over 8 months
for complaint_id in range(1, 2001):
    # Complaint date
    days_offset = random.randint(0, 240)
    complaint_date = start_date + datetime.timedelta(days=days_offset)

    # Complaint type
    complaint_type = random.choices(
        complaint_types,
        weights=[25, 15, 12, 10, 8, 10, 5, 5, 7, 3]
    )[0]

    # Priority
    if complaint_type in ["Service-Interruption", "Water-Quality"]:
        priority = random.choices(priorities, weights=[5, 20, 40, 35])[0]
    elif complaint_type in ["High-Bill", "Low-Pressure", "Leak-Reported"]:
        priority = random.choices(priorities, weights=[10, 40, 40, 10])[0]
    else:
        priority = random.choices(priorities, weights=[40, 40, 15, 5])[0]

    # Status based on age
    age_days = (start_date + datetime.timedelta(days=240) - complaint_date).days
    if age_days < 2:
        status = "Open"
    elif age_days < 5:
        status = random.choice(["Open", "In-Progress"])
    elif age_days < 15:
        status = random.choice(["In-Progress", "Resolved"])
    else:
        status = random.choices(statuses, weights=[2, 5, 20, 73])[0]

    # Resolution time
    if status in ["Resolved", "Closed"]:
        if priority == "Critical":
            resolution_hours = random.uniform(1, 12)
        elif priority == "High":
            resolution_hours = random.uniform(4, 48)
        elif priority == "Medium":
            resolution_hours = random.uniform(24, 120)
        else:
            resolution_hours = random.uniform(48, 240)

        resolution_date = complaint_date + datetime.timedelta(hours=resolution_hours)
    else:
        resolution_hours = None
        resolution_date = None

    # Customer info
    customer_id = f"CUST-{random.randint(1, 5000):05d}"

    # Geographic clustering of complaints
    if complaint_type == "Low-Pressure" and random.random() < 0.4:
        location = "Zone-H-Hills"  # Pressure issues zone
    elif complaint_type == "Water-Quality" and random.random() < 0.3:
        location = random.choice(["Station-02-Industrial", "Station-12-Suburb-West"])
    else:
        location = random.choice(monitoring_stations + pressure_zones)

    complaint_data.append({
        'complaint_id': f"COMP-{complaint_id:05d}",
        'customer_id': customer_id,
        'complaint_date': complaint_date.strftime('%Y-%m-%d %H:%M:%S'),
        'complaint_type': complaint_type,
        'priority': priority,
        'status': status,
        'location': location,
        'resolution_date': resolution_date.strftime('%Y-%m-%d %H:%M:%S') if resolution_date else None,
        'resolution_hours': round(resolution_hours, 1) if resolution_hours else None,
        'customer_satisfied': random.choice(['Yes', 'No', 'Pending']) if status in ["Resolved", "Closed"] else None
    })

# Sort by date
complaint_data.sort(key=lambda x: x['complaint_date'])

# Write to CSV
with open(DATA_DIR / 'customer-complaints.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=complaint_data[0].keys())
    writer.writeheader()
    writer.writerows(complaint_data)

print(f"  Created customer-complaints.csv with {len(complaint_data):,} records")

# ============================================================================
# Summary
# ============================================================================
print("\n" + "="*70)
print("DATASET GENERATION COMPLETE")
print("="*70)
print(f"\nGenerated 6 synthetic datasets in {DATA_DIR}/")
print(f"\n1. water-quality-monitoring.csv: {len(quality_data):,} records")
print(f"2. distribution-network-performance.csv: {len(network_data):,} records")
print(f"3. energy-usage.csv: {len(energy_data):,} records")
print(f"4. maintenance-records.csv: {len(maintenance_data):,} records")
print(f"5. customer-consumption.csv: {len(consumption_data):,} records")
print(f"6. customer-complaints.csv: {len(complaint_data):,} records")
print(f"\nTotal records: {len(quality_data) + len(network_data) + len(energy_data) + len(maintenance_data) + len(consumption_data) + len(complaint_data):,}")
print("\nKey features embedded in datasets:")
print("- Realistic time-series patterns (hourly/daily/seasonal)")
print("- Quality exceedances and compliance issues")
print("- NRW/water loss problems (varying by zone)")
print("- Energy inefficiencies and peak demand issues")
print("- Asset failures and maintenance patterns")
print("- Customer anomalies (leaks, billing issues)")
print("- Geographic clustering of problems")
print("- Incident investigation scenarios (Aug 15 turbidity event)")
print("\nDatasets are ready for facilis.ai demo prompts!")
