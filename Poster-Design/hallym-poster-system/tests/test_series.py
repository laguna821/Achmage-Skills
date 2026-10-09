import copy,json,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from poster_series import validate,paper,html_document,wrap,paper_preflight
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
class SeriesTests(unittest.TestCase):
 def spec(self):
  return dict(schemaVersion=2,title='검증 포스터',frame=dict(title='검증 행사',date='2026',place='시험'),composition=dict(mode='complete-posters',sharedRefs=['one','essential']),content=[dict(id='one',title='검증 포스터',body='원고와 수치 123'),dict(id='essential',title='참여 조건',body='참가비 무료, 모든 연구자 참여')],scenes=[dict(id='one',label='핵심',focus='행사 전체 안내',refs=['one','essential'],theme='light',seconds=1)],print=dict(margin='A',rows=[['one'],['essential']]),logos=[])
 def multi(self):
  s=self.spec()
  for k in ['a','b']:
   s['content'].append(dict(id=k,title='추가 상세 '+k,body=('검증용 충분한 상세 원고와 근거, 조건을 모두 보존합니다. '+k+' ')*9))
  s['composition']['splitReason']='한 장 조판을 검토했으나 추가 상세가 완결 포스터 한 장 분량이어서 두 장을 균형 있게 재편집했다.'
  s['scenes']=[dict(id=k,label='완결 포스터 '+k,focus='장별 추가 상세 '+k,refs=['one',k,'essential'],theme='light' if k=='a' else 'dark') for k in ['a','b']]
  s['print']['rows']=[['one'],['a','b'],['essential']]
  return s
 def test_complete_multi(self):
  validate(self.multi())
 def test_missing_essentials(self):
  s=self.multi();s['scenes'][1]['refs'].remove('essential')
  with self.assertRaisesRegex(ValueError,'repeat shared'):validate(s)
 def test_leftover_rejected(self):
  s=self.multi();s['content'][-1]['body']='남은 짧은 안내'
  with self.assertRaisesRegex(ValueError,'Sparse leftover'):validate(s)
 def test_split_without_reason(self):
  s=self.multi();s['composition']['splitReason']=''
  with self.assertRaisesRegex(ValueError,'one complete'):validate(s)
 def test_duplicate_theme_page(self):
  s=self.multi();s['scenes'][1]['refs']=s['scenes'][0]['refs']
  with self.assertRaisesRegex(ValueError,'distinct detail'):validate(s)
 def test_imbalanced_pages(self):
  s=self.multi();s['content'][-1]['body']*=4
  with self.assertRaisesRegex(ValueError,'Unbalanced'):validate(s)

 def test_coverage(self):
  s=self.spec();s['print']['rows']=[[]]
  with self.assertRaisesRegex(ValueError,'print page refs'):validate(s)
 def test_url(self):
  s=self.spec();s['content'][0]['url']='javascript:alert(1)'
  with self.assertRaises(ValueError):validate(s)
 def test_duration(self):
  for x in [True,float('nan'),0,0.999,121]:
   s=self.spec();s['scenes'][0]['seconds']=x
   with self.assertRaises(ValueError):validate(s)
 def test_four_second_default_and_override(self):
  s=self.spec();del s['scenes'][0]['seconds'];validate(s)
  h=html_document(s,ROOT,b'')
  self.assertIn('data-seconds="4"',h)
  s['scenes'][0]['seconds']=1;validate(s)
  self.assertIn('data-seconds="1"',html_document(s,ROOT,b''))
  s['scenes'][0]['seconds']=15;validate(s)
  self.assertIn('data-seconds="15"',html_document(s,ROOT,b''))
 def test_initial_theme_matches_first_scene(self):
  s=self.spec();s['scenes'][0]['theme']='dark';s['defaultTheme']='authored'
  h=html_document(s,ROOT,b'')
  self.assertIn('<html lang="ko" data-theme="dark">',h)
  self.assertIn('name="theme-color" content="#0c1c31"',h)
  self.assertIn('전체 화면 테마',h)
 def test_svg(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'bad.svg';p.write_text('<svg xmlns="http://www.w3.org/2000/svg"><image href="file:///secret"/></svg>')
   s=self.spec();s['logos']=[dict(file=str(p),fileDark=str(p),darkProvenance='test',source='test',role='주최',name='test')]
   with self.assertRaises(ValueError):validate(s)
 def test_paper_and_screen(self):
  with tempfile.TemporaryDirectory() as d:
   s=validate(self.spec());o=Path(d);a=paper(s,o);r=PdfReader(o/'poster.pdf')
   self.assertEqual(len(r.pages),1);self.assertEqual(a['missingFields'],[])
   self.assertTrue(paper_preflight(o/'poster.pdf')['embeddedFonts'])
   self.assertAlmostEqual(float(r.pages[0].trimbox.width)*25.4/72,420,places=3)
   self.assertAlmostEqual(float(r.pages[0].mediabox.height)*25.4/72,598,places=3)
   self.assertIn('원고와 수치 123',r.pages[0].extract_text())
   s['content'][0]['body']='<script>bad</script>'
   h=html_document(s,o,(o/'poster.pdf').read_bytes())
   self.assertIn('&lt;script&gt;bad&lt;/script&gt;',h)
 def test_dual_logo_validation(self):
  with tempfile.TemporaryDirectory() as d:
   light=Path(d)/'light.svg';dark=Path(d)/'dark.svg'
   light.write_text('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10v10z" fill="#000"/></svg>')
   dark.write_text('<svg xmlns="http://www.w3.org/2000/svg"><script>bad()</script></svg>')
   s=self.spec();s['logos']=[dict(file=str(light),source='test',role='기관',name='기관')]
   with self.assertRaisesRegex(ValueError,'pair'):validate(s)
   s['logos'][0].update(fileDark=str(dark),darkProvenance='derived')
   with self.assertRaisesRegex(ValueError,'Vector-only'):validate(s)
   dark.write_text(light.read_text().replace('#000','#fff'))
   validate(s);h=html_document(s,ROOT,b'')
   self.assertIn('class="logo-light"',h);self.assertIn('class="logo-dark"',h)
 def test_logo_strip(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'logo.svg';p.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>')
   s=self.spec();s['logos']=[dict(file=str(p),fileDark=str(p),darkProvenance='test',name=n,role='기관',source='test') for n in ['첫 기관','다음 기관']]
   a=paper(validate(s),Path(d));x,y=a['logoStrip']
   self.assertAlmostEqual(y['xMm']-x['xMm']-x['widthMm'],12,places=4)
   self.assertEqual(x['heightMm'],y['heightMm'])

 def explicit_paper(self):
  s=self.multi();s['print'].pop('rows');s['print'].update(allowMultiplePages=True,multiPageReason='사용자가 종이도 두 장을 별도 인쇄하라고 명시적으로 요청했다.')
  s['print']['pages']=[dict(id=k,focus='독립 포스터 '+k,rows=[['one'],[k],['essential']]) for k in ['a','b']]
  return s
 def test_explicit_two_papers_with_source_links(self):
  s=self.explicit_paper();s['content'][2]['url']='https://example.org/presentation'
  with tempfile.TemporaryDirectory() as d:
   a=paper(validate(s),Path(d));pdf=PdfReader(Path(d)/'poster.pdf')
   self.assertEqual(a['pages'],2);self.assertEqual(len(pdf.pages),2)
   self.assertEqual(a['missingFields'],[])
   for p in pdf.pages:
    self.assertIn('검증 포스터',p.extract_text())
    self.assertIn('참여 조건',p.extract_text())
    self.assertAlmostEqual(float(p.trimbox.width)*25.4/72,420,places=3)
    self.assertAlmostEqual(float(p.mediabox.height)*25.4/72,598,places=3)
   self.assertTrue(any(a.get_object().get('/A',{}).get('/URI')=='https://example.org/presentation' for a in pdf.pages[0].get('/Annots',[])))
 def test_explicit_paper_rejects_missing_shared(self):
  s=self.explicit_paper();s['print']['pages'][1]['rows']=[['one'],['b']]
  with self.assertRaisesRegex(ValueError,'repeat shared'):validate(s)
 def test_print_contract_ambiguity(self):
  s=self.explicit_paper();s['print']['rows']=[['one']]
  with self.assertRaisesRegex(ValueError,'OR explicit'):validate(s)
 def test_paper_word_wrapping(self):
  from reportlab.pdfbase import pdfmetrics
  with tempfile.TemporaryDirectory() as d:paper(self.spec(),Path(d))
  text='내 판단으로 Skills를 작성합니다 긴낱말ABCDEFGHIJKLMN'
  ll=wrap(text,110,18)
  self.assertEqual(''.join(text.split()),''.join(''.join(ll).split()))
  self.assertTrue(all(pdfmetrics.stringWidth(x,'P400',18)<=110 for x in ll))
  self.assertTrue(any('Skills를' in x for x in ll))
 def test_paper_multiple_pages_require_user_reason(self):
  s=self.explicit_paper();s['print'].pop('allowMultiplePages')
  with self.assertRaisesRegex(ValueError,'defaults to one'):validate(s)
 def test_default_alternating_even_when_authored_themes_are_equal(self):
  s=self.multi()
  for sc in s['scenes']:sc['theme']='light'
  h=html_document(validate(s),ROOT,b'')
  self.assertIn('라이트 · 다크 교차 (기본)',h)
  self.assertIn('"defaultTheme": "alternating"',h)
 def test_non_cmyk_output_profile_rejected(self):
  from PIL import ImageCms
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'rgb.icc';p.write_bytes(ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes())
   s=self.spec();s['print']['iccProfile']=str(p)
   with self.assertRaisesRegex(ValueError,'CMYK output'):validate(s)
 def test_paper_count_is_independent(self):
  s=self.multi();validate(s)
  with tempfile.TemporaryDirectory() as d:self.assertEqual(paper(s,Path(d))['pages'],1)

if __name__=='__main__':unittest.main()

