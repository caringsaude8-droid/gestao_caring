# Serviços - TEA Terapeuta

Este diretório agrupa serviços relacionados ao módulo **TEA Terapeuta**.

Padrões:
- Utilizar `@Injectable({ providedIn: 'root' })` ou escopo de módulo conforme necessidade.
- Separar responsabilidades (ex.: `terapeuta-data.service`, `terapeuta-actions.service`).
- Tipar respostas usando interfaces do diretório `interfaces`.