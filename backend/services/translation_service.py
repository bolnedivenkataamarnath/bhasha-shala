from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from IndicTransToolkit import IndicProcessor
import torch


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

        # Use CPU for stable local inference
        self.model = self.model.to("cpu")
        self.model.eval()

        self.processor = IndicProcessor(inference=True)

        self.language_map = {
            "en": "eng_Latn",
            "hi": "hin_Deva",
            "te": "tel_Telu",
            "ta": "tam_Taml",
            "kn": "kan_Knda",
            "ml": "mal_Mlym",
            "bn": "ben_Beng",
            "mr": "mar_Deva",
            "or": "ory_Orya",
            "as": "asm_Beng",
            "sat": "sat_Olck",
        }

        print("IndicTrans2 model loaded successfully!")

    def translate(
        self,
        text: str,
        source_lang: str = "en",
        target_lang: str = "sat",
    ) -> str:

        source_language = self.language_map.get(
            source_lang,
            source_lang,
        )

        target_language = self.language_map.get(
            target_lang,
            target_lang,
        )

        print(
            f"Translating: "
            f"{source_language} -> {target_language}"
        )

        print(f"Text: {text}")

        # Prepare input for IndicTrans2
        batch = self.processor.preprocess_batch(
            [text],
            src_lang=source_language,
            tgt_lang=target_language,
        )

        # Tokenize
        inputs = self.tokenizer(
            batch,
            truncation=True,
            padding="longest",
            return_tensors="pt",
            return_attention_mask=True,
        )

        # Make sure tensors are on CPU
        inputs = {
            key: value.to("cpu")
            for key, value in inputs.items()
        }

        # Inference without gradient calculation
        with torch.no_grad():
            generated_tokens = self.model.generate(
                **inputs,
                max_length=128,
                num_beams=1,
                num_return_sequences=1,
                use_cache=False,
            )

        # Convert generated tokens to text
        decoded = self.tokenizer.batch_decode(
            generated_tokens,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=True,
        )

        # Post-process IndicTrans2 output
        translations = self.processor.postprocess_batch(
            decoded,
            lang=target_language,
        )

        if not translations:
            return ""

        return translations[0]

    def translate_multiple(
        self,
        text: str,
        source_lang: str,
        target_langs: list[str],
    ) -> dict[str, str]:

        translations = {}

        for target_lang in target_langs:
            try:
                translations[target_lang] = self.translate(
                    text,
                    source_lang=source_lang,
                    target_lang=target_lang,
                )
            except Exception as error:
                print(
                    f"Translation failed for "
                    f"{target_lang}: {error}"
                )

                translations[target_lang] = (
                    "Translation failed."
                )

        return translations


translation_service = TranslationService()