import streamlit as st
import csv
import json

st.title("Problematic Word List Collector")

st.write(
    "This app assists a user in collecting a list of problematic and semi-problematic words."
)


@st.cache_data
def get_word_freq():
    with open("./word_freq_5000.csv", "r") as f:
        reader = csv.reader(f)
        word_freq = list(reader)
        words = [word[0] for word in word_freq]
        freqs = [float(word[1]) for word in word_freq]
        return words, freqs


words, freqs = get_word_freq()

page_num = st.session_state.get("page_num", 0)

if "yellow_words" not in st.session_state:
    st.session_state.yellow_words = {}
    st.session_state.red_words = {}

with st.sidebar:
    page_size = st.number_input("Page Size", value=20)
    page_count = len(words) // page_size
    st.write(f"Page Count: {page_count}")
    show_freqs = st.toggle("Show Frequencies", value=False)
    capitalize = st.toggle("Capitalize", value=False)
    reset_page = st.button("Reset Page")
    reset = st.button("Reset Words")
    export = st.download_button(
        "Export",
        json.dumps(
            {
                "red": [
                    word
                    for word, enabled in st.session_state.red_words.items()
                    if enabled
                ],
                "yellow": [
                    word
                    for word, enabled in st.session_state.yellow_words.items()
                    if enabled
                ],
            },
        ),
        "problematic_words.json",
        "application/json",
    )

    with st.expander("Import"):
        uploaded_file = st.file_uploader("Choose a file")
        if uploaded_file is not None:
            content = uploaded_file.getvalue()
            data = json.loads(content)
            imported_red_words = {
                word: True for word in data.get("red", [])
            }
            imported_yellow_words = {
                word: True for word in data.get("yellow", [])
            }
            print("Done importing", imported_red_words, imported_yellow_words)
        apply = st.button("Apply Import")
        if apply:
            st.session_state.red_words = imported_red_words
            st.session_state.yellow_words = imported_yellow_words
            uploaded_file = None


    if reset_page:
        st.session_state.page_num = 0
        st.experimental_rerun()
    if reset:
        st.session_state.red_words = {}
        st.session_state.yellow_words = {}
        st.experimental_rerun()

word_picker, word_viewer = st.tabs(["Pick Words", "View Words"])

def draw_navigator(key="nav"):
    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        prev_page = st.button("Previous Page", disabled=page_num <= 0, key=f"{key}_prev")
    with col2:
        next_page = st.button("Next Page", disabled=page_num >= page_count - 1, key=f"{key}_next")
    with col3:
        st.write(f"Page {page_num+1} of {page_count}")

    if next_page:
        st.session_state.page_num = page_num + 1
        st.experimental_rerun()
    if prev_page:
        st.session_state.page_num = page_num - 1
        st.experimental_rerun()


with word_picker:

    draw_navigator()

    # show 50 most common words and have a radio button for user to select red yellow, or green
    for i in range(page_num * page_size, (page_num + 1) * page_size):
        word = words[i]
        freq = freqs[i]
        col1, col2, col3 = st.columns([1, 1, 1])
        with col1:
            pretty_word = word.capitalize() if capitalize else word
            st.write(
                f"{(pretty_word)} ({round(freq, 3)})" if show_freqs else pretty_word
            )
        with col2:
            st.session_state.red_words[word] = st.checkbox(
                "Red",
                key=f"{word}_red",
                value=st.session_state.red_words.get(word, False),
            )
        with col3:
            st.session_state.yellow_words[word] = st.checkbox(
                "Yellow",
                key=f"{word}_yellow",
                value=st.session_state.yellow_words.get(word, False),
            )
    
    draw_navigator("second_nav")

with word_viewer:
    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        new_word = st.text_input("New Word")
    with col2:
        b1 = st.button("Add to Red")

        if b1:
            st.session_state.red_words[new_word.lower()] = True
            st.experimental_rerun()

    with col3:
        b2 = st.button("Add to Yellow")

        if b2:
            st.session_state.yellow_words[new_word.lower()] = True
            st.experimental_rerun()

    col1, col2 = st.columns([1, 1])
    with col1:
        st.write("Red Words")
        st.write(
            [word for word, enabled in st.session_state.red_words.items() if enabled]
        )
    with col2:
        st.write("Yellow Words")
        st.write(
            [word for word, enabled in st.session_state.yellow_words.items() if enabled]
        )
