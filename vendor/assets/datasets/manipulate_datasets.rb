require 'json'
require 'csv'

JSON_FILE = 'restaurants_list.json'.freeze
CSV_FILE = 'restaurants_info.csv'.freeze
CSV_TO_JSON_FILE = 'restaurants_info_to_json.json'.freeze
OUTPUT = 'restaurants_list_with_info.json'.freeze

File.delete(CSV_TO_JSON_FILE) if File.exist?(CSV_TO_JSON_FILE)
File.delete(OUTPUT) if File.exist?(OUTPUT)

csv_to_json = CSV.parse(File.read(CSV_FILE), headers: true, col_sep: ';').map(&:to_hash).to_json
File.open(CSV_TO_JSON_FILE, 'w') { |f| f.write(csv_to_json) }

file1 = File.read(JSON_FILE)
file2 = File.read(CSV_TO_JSON_FILE)

arr1 = JSON[file1].sort_by { |e| e['objectID'].to_i }
arr2 = JSON[file2].sort_by { |e| e['objectID'].to_i }

merged = []

arr1.each do |e1|
  arr2.each do |e2|
    merged.push(e2.merge(e1)) if e2['objectID'].to_i == e1['objectID'].to_i
  end
end

merged.map { |h| h.to_json.gsub!(/\"/, '\'') }

File.open(OUTPUT, 'w') { |f| f.write(merged.to_json) }
File.delete(CSV_TO_JSON_FILE) if File.exist?(CSV_TO_JSON_FILE)
