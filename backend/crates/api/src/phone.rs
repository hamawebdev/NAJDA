//! Algerian phone number normalization.
//!
//! Accepts local (`0550 12 34 56`) and international (`+213 550…`, `00213…`)
//! spellings and stores everything as the local 10-digit `0XXXXXXXXX` form.

/// Normalize a phone number, returning `None` when it is not a plausible
/// Algerian number (10 digits, leading `0`, second digit 2–9 — covers
/// mobiles 05/06/07 and regional landlines).
pub fn normalize(input: &str) -> Option<String> {
    let cleaned: String = input
        .chars()
        .filter(|c| !matches!(c, ' ' | '-' | '.' | '(' | ')'))
        .collect();

    let local = if let Some(rest) = cleaned.strip_prefix("+213") {
        format!("0{rest}")
    } else if let Some(rest) = cleaned.strip_prefix("00213") {
        format!("0{rest}")
    } else {
        cleaned
    };

    let bytes = local.as_bytes();
    let valid = local.len() == 10
        && local.chars().all(|c| c.is_ascii_digit())
        && bytes[0] == b'0'
        && (b'2'..=b'9').contains(&bytes[1]);
    valid.then_some(local)
}

#[cfg(test)]
mod tests {
    use super::normalize;

    #[test]
    fn accepts_local_mobile_and_landline() {
        assert_eq!(normalize("0550123456").as_deref(), Some("0550123456"));
        assert_eq!(normalize("0212345678").as_deref(), Some("0212345678"));
    }

    #[test]
    fn strips_separators() {
        assert_eq!(normalize("0550 12-34.56").as_deref(), Some("0550123456"));
        assert_eq!(normalize("(0550) 123 456").as_deref(), Some("0550123456"));
    }

    #[test]
    fn maps_international_prefixes_to_local() {
        assert_eq!(normalize("+213550123456").as_deref(), Some("0550123456"));
        assert_eq!(normalize("+213 550 123 456").as_deref(), Some("0550123456"));
        assert_eq!(normalize("00213550123456").as_deref(), Some("0550123456"));
    }

    #[test]
    fn rejects_bad_numbers() {
        assert_eq!(normalize(""), None);
        assert_eq!(normalize("12345"), None);
        assert_eq!(normalize("1550123456"), None); // must start with 0
        assert_eq!(normalize("0050123456"), None); // second digit 2–9
        assert_eq!(normalize("055012345"), None); // too short
        assert_eq!(normalize("05501234567"), None); // too long
        assert_eq!(normalize("0550x23456"), None); // non-digit
    }
}
