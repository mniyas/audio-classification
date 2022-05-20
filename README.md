# audio-classification
This project aims to classify between StarWars and HarryPotter theme songs based on hummings or whistles to the song themes.

The data was collected through crowd sourcing from students at QMUL. The input data consists of the audio file and meta data encoded in the file name of audio files. More details about data is available [here](https://www.kaggle.com/datasets/jesusrequena/mlend-hums-and-whistles). The ML pipeline involves three stages. 
- Data Preprocessing - Meta data from file names were extracted. Output of this stage will be dataframes with each file name and song name columns.
- Feature Engineering - Features were extracted from the audio files which are in WAV format. These can be audio/signal processing features such as pitch, frequencies, power, etc. Noise were removed before feature extraction and  then the extracted features will be noramalized.
- Classification - Models were trained based on the extracted features and song name collected earlier. The classifier will predict the song label from features extracted from unseen audio data.

The trained model is deployed [here](http://starwarsvspotter.herokuapp.com/)

Each step is documented in the training and deployment notebooks.
