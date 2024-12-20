import requests

team_codes = []
# Get all teams
res = requests.get('https://api-web.nhle.com/v1/standings/now')
for team in res.json()['standings']:
    team_codes.append(team['teamAbbrev']['default'])

# Get all players
player_file = open('players.txt', "a")
url = 'https://api-web.nhle.com/v1/roster/{}/current'
for team in team_codes:
    res = requests.get(url.format(team))
    players = [player for position in ['forwards', 'defensemen', 'goalies'] for player in res.json()[position]]
    for player in players:
        player_file.write(f'{player["id"]}\n')
player_file.close()