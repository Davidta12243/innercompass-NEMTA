import sqlite3

conn = sqlite3.connect('dulich.db')
cur = conn.cursor()

def escape_sql(val):
    if val is None:
        return 'NULL'
    if isinstance(val, (int, float)):
        return str(val)
    return "'" + str(val).replace("'", "''") + "'"

lines = ['-- Seed Data for Supabase\n']

# Tours
tours = cur.execute('SELECT id, name, price, image_url, slots_left, slots_booked, duration_days, hours_left, route_summary FROM Tours').fetchall()
if tours:
    lines.append('-- Tours\n')
    for t in tours:
        vals = [escape_sql(x) for x in t]
        val_str = ', '.join(vals)
        lines.append(f'INSERT INTO "Tours" (id, name, price, image_url, slots_left, slots_booked, duration_days, hours_left, route_summary) VALUES ({val_str}) ON CONFLICT (id) DO NOTHING;\n')

# Foods
foods = cur.execute('SELECT id, name, category, price, image_url, description, combo_percent, tour_bundle_percent, is_active FROM Foods').fetchall()
if foods:
    lines.append('\n-- Foods\n')
    for f in foods:
        vals = [escape_sql(x) for x in f]
        val_str = ', '.join(vals)
        lines.append(f'INSERT INTO "Foods" (id, name, category, price, image_url, description, combo_percent, tour_bundle_percent, is_active) VALUES ({val_str}) ON CONFLICT (id) DO NOTHING;\n')

# Blogs
blogs = cur.execute('SELECT id, title, destination, summary, content, image_url, tour_id FROM Blogs').fetchall()
if blogs:
    lines.append('\n-- Blogs\n')
    for b in blogs:
        vals = [escape_sql(x) for x in b]
        val_str = ', '.join(vals)
        lines.append(f'INSERT INTO "Blogs" (id, title, destination, summary, content, image_url, tour_id) VALUES ({val_str}) ON CONFLICT (id) DO NOTHING;\n')

lines.append("\n-- Update sequences\n")
lines.append("SELECT setval(pg_get_serial_sequence('\"Tours\"', 'id'), COALESCE(max(id), 1)) FROM \"Tours\";\n")
lines.append("SELECT setval(pg_get_serial_sequence('\"Foods\"', 'id'), COALESCE(max(id), 1)) FROM \"Foods\";\n")
lines.append("SELECT setval(pg_get_serial_sequence('\"Blogs\"', 'id'), COALESCE(max(id), 1)) FROM \"Blogs\";\n")

with open('seed_supabase.sql', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Generated seed_supabase.sql successfully')
