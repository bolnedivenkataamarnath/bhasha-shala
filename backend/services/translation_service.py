from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from IndicTransToolkit import IndicProcessor


class TranslationService:
    def __init__(self):
        self.model_name = "ai4bharat/indictrans2-en-indic-dist-200M"

        print("Loading IndicTrans2 model...")

        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_name,
            trust_remote_code=True,
        )

        self.model = AutoModelForSeq2SeqLM.from_pretrained(
            self.model_name,
            trust_remote_code=True,
        )

        self.processor = IndicProcessor(inference=True)

        print("IndicTrans2 model loaded successfully!")

    def translate(
        self,
        text: str,
        source_lang: str = "en",
        target_lang: str = "sat",
    ) -> str:

        language_map = {
            "en": "eng_Latn",
            "hi": "hin_Deva",
            "sat": "sat_Olck",
        }

        source_language = language_map.get(source_lang, source_lang)
        target_language = language_map.get(target_lang, target_lang)

        batch = self.processor.preprocess_batch(
            [text],
            src_lang=source_language,
            tgt_lang=target_language,
        )

        inputs = self.tokenizer(
            batch,
            truncation=True,
            padding="longest",
            return_tensors="pt",
            return_attention_mask=True,
        )

        generated_tokens = self.model.generate(
            **inputs,
            use_cache=True,
            min_length=0,
            max_length=256,
            num_beams=5,
            num_return_sequences=1,
        )

        decoded = self.tokenizer.batch_decode(
            generated_tokens,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True,
        )

        translations = self.processor.postprocess_batch(
            decoded,
            lang=target_language,
        )

        return translations[0]


translation_service = TranslationService()