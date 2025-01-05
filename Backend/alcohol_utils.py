def calculate_bac(uzytkownik_id, historia_data):
    from datetime import datetime
    from Models import Uzytkownik

    # Pobranie danych o użytkowniku
    waga = Uzytkownik.get_waga(uzytkownik_id)
    plec = Uzytkownik.get_plec(uzytkownik_id)

    # Ustalenie współczynnika r w zależności od płci
    r = 0.68 if plec  else 0.55
    bac = 0


    # Zmienna do przechowywania łącznej ilości alkoholu
    total_alcohol_grams = 0
    current_time = datetime.now()
    
    # Iterowanie przez historię picia alkoholu
    for record in historia_data:
        zawartosc_procentowa = record['zawartosc_procentowa']
        ilosc_wypitego_ml = record['ilosc_wypitego_ml']
        czas_picia = datetime.strptime(record['data'], "%Y-%m-%d %H:%M:%S")  # Czas spożycia alkoholu

        # Przekształcamy ml na gramy alkoholu (0.8 to g/ml dla alkoholu)
        alcohol_grams = (ilosc_wypitego_ml * zawartosc_procentowa /100 * 0.8)
        total_alcohol_grams += alcohol_grams

    # Obliczanie BAC w oparciu o całkowitą ilość alkoholu
    bac = total_alcohol_grams / (waga * 1000 * r)  # BAC w promilach
    
    # Spadek BAC na podstawie czasu, który minął od spożycia
    time_diff = current_time - datetime.strptime(historia_data[-1]['data'], "%Y-%m-%d %H:%M:%S")
    print(time_diff)
    hours_since_drinking = time_diff.total_seconds() / 3600  # Czas w godzinach
    bac -= 0.015 * hours_since_drinking  # Spadek BAC o 0.015 na godzinę
    
    if bac < 0:
        bac = 0
    # Ustalenie stanu użytkownika na podstawie BAC
    if bac < 0.02:
        stan = "Trzeźwy"
    elif 0.02 <= bac < 0.05:
        stan = "Lekka nietrzeźwość"
    elif 0.05 <= bac < 0.08:
        stan = "Średnia nietrzeźwość"
    elif 0.08 <= bac < 0.15:
        stan = "Poważna nietrzeźwość"
    else:
        stan = "Stan ciężkiego upojenia"
    print(bac,stan)
    return round(bac, 2), stan
